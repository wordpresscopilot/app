import { z } from "zod";

export const ExtractionPipelineFormSchema = z.object({
  userRequest: z
    .string()
    .min(5)
    .describe("The user's request for data extraction"),
  coreSiteData: z.any().describe("The core site data"),
  wpSite: z.any().describe("The WordPress site data"),
});
