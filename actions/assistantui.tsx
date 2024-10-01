"use server";

import { WpSite } from "@/types";
import { openai } from "@ai-sdk/openai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import { z } from "zod";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string,
  site: WpSite
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
    system: `
      Site Base URL: ${site?.base_url}
      
      Given the following user messages for data extraction from a WordPress site. Generate a SQL query that will extract the requested data. Consider the following:
      1. The query should be compatible with WordPress database structure.
      2. Include necessary JOINs to fetch data from related tables.
      3. Use appropriate WHERE clauses to filter data as per the user's request.
      4. Limit the result set if necessary to prevent overwhelming data volumes.
      5. Don't assume meta keys exist. 
      6. Query to return for more data, unless otherwise specified.
      7. When retrieving images, find the full url slug from the post attachment ID
      
      `,
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      deploy: {
        description: "Deploy repository to vercel",
        parameters: z.object({
          repositoryName: z
            .string()
            .describe("The name of the repository, example: vercel/ai-chatbot"),
        }),
        generate: async function* ({ repositoryName }) {
          yield <div>Cloning repository {repositoryName}...</div>;
          await new Promise((resolve) => setTimeout(resolve, 3000));
          yield <div>Building repository {repositoryName}...</div>;
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return <div>{repositoryName} deployed!</div>;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
