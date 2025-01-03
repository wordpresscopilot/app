// @ts-nocheck

"use server";

import { ExtractionPipelineFormSchema } from "@/actions/types/extraction-pipeline";
import { executeWordPressSQL } from "@/actions/wp";
import { runSiteHealthCheck } from "@/data/site";
import { WP_PATH_RUN_SQL } from "@/lib/paths";
import { WpSite } from "@/types";
import { UserRequestCategoryType } from "@/types/export-pipeline";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject } from "ai";
import { z } from "zod";

export const runExtractionPipeline = async (
  formData: z.infer<typeof ExtractionPipelineFormSchema>
) => {
  const { userRequest, coreSiteData, wpSite } = formData;

  console.log("runExtractionPipeline", wpSite, userRequest);
  try {
    // Step 1: Categorize the request
    const categories = await categorizeRequest(userRequest);
    console.log("categories", categories);

    // Step 2: Verify permissions
    const hasPermissions = await verifyHasSitePermissions(wpSite);
    console.log("hasPermissions", hasPermissions);
    if (!hasPermissions) {
      throw new Error("Insufficient permissions to perform data extraction.");
    }

    // Step 3: Recognize entity intent
    // const recognizedIntent = await recognizeEntityIntent(user_request);
    // console.log("recognizedIntent", recognizedIntent);
    // Step 4: Check data availability
    // const availabilityCheck = await dataAvailabilityCheck(
    //   recognizedIntent,
    //   wpSite
    // );
    // console.log("availabilityCheck", availabilityCheck);
    // if (!availabilityCheck.isExtractionFeasible) {
    //   throw new Error(
    //     `Data extraction not feasible: ${availabilityCheck.explanation}`
    //   );
    // }

    // Step 5: Generate SQL query
    const generatedQuery = await generateQuery({
      site: wpSite,
      user_request: userRequest,
      core_site_data: coreSiteData,
    });
    console.log("generatedQuery", generatedQuery);
    console.log();
    // Step 6: Execute the generated query
    const extractionResult = await executeWordPressSQL({
      query: generatedQuery?.object?.sqlQuery,
      api_key: wpSite.api_key,
      api_url: `${wpSite.base_url}${WP_PATH_RUN_SQL}`,
    });

    console.log("extractionResult", extractionResult);
    if (!extractionResult.ok || extractionResult.error) {
      throw new Error(
        `Failed to execute extraction query: ${
          extractionResult.error?.message || "Unknown error"
        }`
      );
    }

    return {
      success: true,
      data: extractionResult.data,
      query: generatedQuery.object?.sqlQuery,
      explanation: generatedQuery.object?.explanation,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const categorizeRequest = async ({
  messages,
}: {
  messages: CoreMessage[];
}) => {
  const system = `Categorize the following message, which action state does it belong to? Provide the category name.`;
  const result = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-turbo"),
    output: "array",
    system,
    messages,
    schema: z.object({
      category: z.enum([
        UserRequestCategoryType.DATA_EXTRACTION_REQUEST,
        UserRequestCategoryType.RUN_SQL_QUERY,
        // UserRequestCategoryType.DATA_EXPLANATION,
        // UserRequestCategoryType.CONTENT_CREATION,
        // UserRequestCategoryType.SITE_MANAGEMENT,
        // UserRequestCategoryType.PLUGIN_MANAGEMENT,
        UserRequestCategoryType.OTHER,
      ]),
    }),
  });

  // if (result?.object?.category !== "data_extraction") {
  //   throw new Error(
  //     `Request is not related to data extraction. Category: ${result?.object?.category}`
  //   );
  // }
  return result?.object?.[0].category;
};

export const recognizeEntityIntent = async (user_request: string) => {
  const result = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-o", {
      structuredOutputs: true,
    }),
    prompt: `
    Analyze the following user request for data extraction: "${user_request}"
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
  return result;
};

export const verifyHasSitePermissions = async (
  wpSite: WpSite
): Promise<boolean> => {
  const healthCheckResult = await runSiteHealthCheck(
    wpSite.id,
    wpSite.base_url
  );
  return healthCheckResult;
  // && healthCheckResult.api_key_valid === true;
};

export const dataAvailabilityCheck = async (
  recognizedIntent: Awaited<ReturnType<typeof recognizeEntityIntent>>,
  wpSite: WpSite
) => {
  // Execute a query to get a sample of data from the site
  const sampleQuery = `
    SELECT post_type, COUNT(*) as count 
    FROM wp_posts 
    GROUP BY post_type 
    LIMIT 10;
  `;

  const queryResult = await executeWordPressSQL({
    query: sampleQuery,
    api_key: wpSite.api_key,
    api_url: `${wpSite.base_url}${WP_PATH_RUN_SQL}`,
  });

  if (!queryResult.ok || queryResult.error) {
    throw new Error(
      `Failed to execute SQL query: ${
        queryResult.error?.message || "Unknown error"
      }`
    );
  }

  // Use AI to verify if the data export can work based on the sample data
  const verificationResult = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-o", {
      structuredOutputs: true,
    }),
    prompt: `
    Analyze the following sample data from a WordPress site:
    ${JSON.stringify(queryResult.data, null, 2)}

    // User's extraction intent:
    // ${JSON.stringify(recognizedIntent, null, 2)}

    Determine if the requested data extraction is feasible based on this sample.
    Consider the entities, fields, and plugins requested by the user.
    `,
    schema: z.object({
      isExtractionFeasible: z.boolean(),
      explanation: z.string(),
      missingData: z.array(z.string()).optional(),
      recommendations: z.array(z.string()).optional(),
    }),
  });
  return verificationResult;
};
// site: wpS
//   recognizedIntent: Awaited<ReturnType<typeof recognizeEntityIntent>>
// ) => {
export const generateQuery = async ({
  site,
  user_request,
  core_site_data,
}: {
  site?: WpSite;
  user_request: string;
  core_site_data: any;
}) => {
  const queryGenerationResult = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-0613", {
      structuredOutputs: true,
    }),
    prompt: `
    Given the following user query for data extraction from a WordPress site:${user_request}

    Site Base URL: ${site?.base_url}
    Core Site Data: ${core_site_data}
    
    Generate a SQL query that will extract the requested data. Consider the following:
    1. The query should be compatible with WordPress database structure.
    2. Include necessary JOINs to fetch data from related tables.
    3. Use appropriate WHERE clauses to filter data as per the user's request.
    4. Limit the result set if necessary to prevent overwhelming data volumes.
    5. Don't assume meta keys exist. 
    6. Query to return for more data, unless otherwise specified.
    7. When retrieving images, find the full url slug from the post attachment ID
    
    `,
    schema: z.object({
      sqlQuery: z.string(),
      explanation: z.string(),
      // potentialIssues: z.array(z.string()).optional(),
    }),
  });

  return queryGenerationResult;
};
