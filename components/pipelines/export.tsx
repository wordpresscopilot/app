"use client";

import { runExtractionPipeline } from "@/actions/extraction-pipeline";
import { spinner } from "@/components/stocks/spinner";
import { Button } from "@/components/ui/button";
import { WpSite } from "@/types";
import { useState } from "react";

interface ExportFormProps {
  site: WpSite;
  core_site_data: any;
}

export default function ExportForm({ site, core_site_data }: ExportFormProps) {
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  console.log("site ExportForm", site);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userRequest = formData.get("userRequest") as string;

    setIsLoading(true);
    try {
      const result = await runExtractionPipeline(
        site,
        core_site_data,
        userRequest
      );
      if (result.success) {
        setExtractionResult(result.data);
        setQuery(result.query);
        setExplanation(result.explanation);
        setError(null);
      } else {
        setError(result.error || "An error occurred during extraction.");
        setExtractionResult(null);
        setQuery(null);
        setExplanation(null);
      }
    } catch (error) {
      setError("An unexpected error occurred during extraction.");
      setExtractionResult(null);
      setQuery(null);
      setExplanation(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Data Export</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="userRequest"
            className="block text-sm font-medium text-gray-700"
          >
            What data would you like to extract?
          </label>
          <textarea
            id="userRequest"
            name="userRequest"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="e.g., Extract all post titles and authors from the last month"
            required
          ></textarea>
        </div>
        <Button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              {spinner}
              <span className="ml-2">Running Extraction...</span>
            </>
          ) : (
            "Run Extraction"
          )}
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {query && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Query:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{query}</pre>
        </div>
      )}
      {explanation && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto">
            {explanation}
          </div>
        </div>
      )}
      {extractionResult && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Extraction Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(extractionResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
