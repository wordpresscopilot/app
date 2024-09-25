"use server";

import { runSiteHealthCheck } from "@/data/site";
import { WP_PATH_RUN_SQL } from "@/lib/paths";
import { WpSite } from "@/types";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { executeWordPressSQL } from "./wp";

export const categorizeRequest = async (user_request: string) => {
  const result = await generateObject({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-4-o", {
      structuredOutputs: true,
    }),
    prompt: `
    Categorize the following user request. Is it related to data extraction or something else?
    Analyze the user's input: "${user_request}". Does it belong to the data extraction category or another category? Provide the category name.`,

    schema: z.object({
      category: z.enum([
        "data_extraction",
        "content_creation",
        "site_management",
        "plugin_management",
        "other",
      ]),
    }),
  });

  if (result?.object?.category !== "data_extraction") {
    throw new Error(
      `Request is not related to data extraction. Category: ${result?.object?.category}`
    );
  }
  return result;
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

export const verifyHasPermissions = async (
  wpSite: WpSite
): Promise<boolean> => {
  const healthCheckResult = await runSiteHealthCheck(
    wpSite.id,
    wpSite.base_url
  );
  console.log("healthCheckResult", healthCheckResult);
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
    api_url: `${wpSite.base_url}/wp-json/wpsage/v1/execute-sql`,
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

export const runExtractionPipeline = async (
  wpSite: WpSite,
  core_site_data: any,
  user_request: string
) => {
  console.log("runExtractionPipeline", wpSite, user_request);
  try {
    // Step 1: Categorize the request
    const categories = await categorizeRequest(user_request);
    console.log("categories", categories);

    // Step 2: Verify permissions
    const hasPermissions = await verifyHasPermissions(wpSite);
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
      user_request,
      core_site_data,
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
