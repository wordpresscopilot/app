"use client";

import { runExtractionPipeline } from "@/actions/extraction-pipeline";
import { spinner } from "@/components/stocks/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        user_request: userRequest,
      );
      if (result.success) {
        setExtractionResult(result.data);
        setQuery(result.query || "");
        setExplanation(result.explanation || "");
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
    <div className="flex flex-col gap-4 max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="userRequest">
                  What data would you like to extract?
                </Label>
                <Textarea
                  id="userRequest"
                  name="userRequest"
                  rows={4}
                  placeholder="e.g., Extract all post titles and authors from the last month"
                  required
                />
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
            </div>
          </form>
        </CardContent>
      </Card>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {query && (
        <Card>
          <CardHeader>
            <CardTitle>Generated SQL Query</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded overflow-auto">{query}</pre>
          </CardContent>
        </Card>
      )}
      {explanation && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>{explanation}</CardContent>
        </Card>
      )}
      {extractionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Extraction Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded overflow-auto">
              {JSON.stringify(extractionResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
