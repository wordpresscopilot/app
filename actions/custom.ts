"use server";

import { runWPSiteAgent } from "@/agents/wp-site-agent";
import { WpSite } from "@/types";
import { Message, Role } from "@/types/export-pipeline";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject } from "ai";
import console from "console";
import { content } from "tailwindcss/defaultTheme";
import { z } from "zod";

const perplexity = createOpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY ?? "",
  baseURL: "https://api.perplexity.ai/",
});

const openpipeOpenai = createOpenAI({
  apiKey: process.env.OPENPIPE_API_KEY ?? "",
  baseURL: "https://api.openpipe.ai/api/v1",
});

export const convertMessagesToCore = async (messages: Message[]): Promise<CoreMessage[]> => {
  console.log("convertMessagesToCore", messages)
   const aiMessages = messages.map(m => ({
    role: m.role === Role.USER ? "user" : "assistant",
    content: [
      { 
        type: "text", 
        text: m.text?.[0]?.text + ((m?.artifacts?.length ?? 0) > 0 ? "\nArtifacts: " + JSON.stringify(m.artifacts) : "")
      },
    ].filter(Boolean) as any,
  })) as CoreMessage[];

  if (aiMessages.length > 10) {
    const firstTwo = aiMessages.slice(0, 2);
    const lastEight=  aiMessages.slice(-8);
    return [...firstTwo, ...lastEight]
  }
  return aiMessages;
};

// unused in latest assistant-nonrsc version
export const runWPAIPipeline = async ({messages, site, core_site_data}: {messages: Message[], site: WpSite, core_site_data: any}) => {
  const {steps, toolCalls } = await runWPSiteAgent({site, messages});
  return {steps, toolCalls};
  // const aiMessages = await convertMessagesToCore(messages);
  // const category = await categorizeRequest({
  //   messages: aiMessages,
  // });
  // console.log("category", category);
  // // if action supported on the wp site, then 
  // if (
  //   category === UserRequestCategoryType.DATA_EXTRACTION_REQUEST ||
  //   category === UserRequestCategoryType.RUN_SQL_QUERY
  // ) {
  //   const hasPermissions = await verifyHasSitePermissions(site);
  //   console.log("hasPermissions", hasPermissions)
  //   if(!hasPermissions) {
  //     return {
  //       ok: false,
  //       error: "We cannot access your wordpress site to complete your request. Please ensure our plugin (WPCopilot) is installed with a valid api key."
  //     }
  //   } 
  // }
  // if (category === UserRequestCategoryType.DATA_EXTRACTION_REQUEST) {
  //     const system = `
  //         Site Base URL: ${site?.base_url}
  //         Core Site Data: ${core_site_data}
          
  //         Given the following user messages for data extraction from a WordPress site. Generate a SQL query that will extract the requested data. Consider the following:
  //         1. The query should be compatible with WordPress database structure.
  //         2. Include necessary JOINs to fetch data from related tables.
  //         3. Use appropriate WHERE clauses to filter data as per the user's request.
  //         4. Limit the result set if necessary to prevent overwhelming data volumes.
  //         5. Don't assume meta keys exist. 
  //         6. Query to return for more data, unless otherwise specified.
  //         7. When retrieving images, find the full url slug from the post attachment ID
  //       `;
  //     const generatedObj = await generateObject({
  //       model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4o-mini",), // openpipeOpenai("gpt-4o-mini"),
  //       messages: aiMessages,
  //       output: "array",
  //       mode: "json",
  //       system,
  //       schema: z.object({
  //         title: z.string().max(50),
  //         sqlQuery: z.string(),
  //         explanation: z.string(),
  //       }),
  //     });

  //     let artifact = {
  //       id: nanoid(),
  //       title: generatedObj.object?.[0]?.title,
  //       description: generatedObj.object?.[0]?.explanation,
  //       toolName: ToolType.GENERATE_SQL,
  //       type: ArtifactType.SQL,
  //       content: [generatedObj.object?.[0]?.sqlQuery],
  //     } as Artifact;
      
  //     return {
  //       ok: true,
  //       artifact,
  //       obj: generatedObj.object,
  //     }
  //   } else {
  //     const system = `\
  //       You are an AI assistant for WordPress site management and development. You help users with tasks related to developing and managing their WordPress site.
  //       However you can, provide useful information for solving a user's questions, converns, or explorations.
  //     `;

  //     const result = await generateText({
  //       model: perplexity("llama-3.1-sonar-large-128k-chat"), // openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-3.5-turbo"),
  //       system,
  //        messages: aiMessages,
  //       tools: {},
  //     });
  //     console.log("text resp result", result)

  //     return {
  //       ok: true,
  //       text: result.text,
  //     }
  //   }
  }


export const callOpenai = async (messages: Message[]) => {
  const result = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-o", {
      structuredOutputs: true,
    }),
    output: "array",
    prompt: `
    Analyze the following user request for data extraction: "${content}"
    Identify the entities, fields, and plugins that the user is requesting data from.
    Include specific post types, date ranges, or user roles.
    Provide a detailed breakdown of the extraction intent.`,

    schema: z.object({
      entities: z
        .array(z.string())
        .describe("The main entities or data types to be extracted"),
      fields: z
        .array(z.string())
        .describe("Specific fields or attributes to be extracted"),
      plugins: z
        .array(z.string())
        .describe(
          "WordPress plugins that might be involved in the data extraction"
        ),
      explanation: z
        .string()
        .describe("A brief explanation of the recognized intent"),
    }),
  });

  return result.object;
};
