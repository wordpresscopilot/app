"use client";

import { runExtractionPipeline } from "@/actions/extraction-pipeline";
import { ExtractionPipelineFormSchema } from "@/actions/types/extraction-pipeline";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WpSite } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ExportFormProps {
  site: WpSite;
  coreSiteData: any;
}

export default function ExportForm({ site, coreSiteData }: ExportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const form = useForm<z.infer<typeof ExtractionPipelineFormSchema>>({
    resolver: zodResolver(ExtractionPipelineFormSchema),
    defaultValues: {
      userRequest: "",
      coreSiteData: coreSiteData,
      wpSite: site,
    },
  });

  const onSubmit = async (
    data: z.infer<typeof ExtractionPipelineFormSchema>
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setExtractionResult(null);
    setQuery(null);
    setExplanation(null);

    try {
      const result = await runExtractionPipeline({
        userRequest: data.userRequest,
        coreSiteData: data.coreSiteData,
        wpSite: data.wpSite,
      });

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
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="userRequest"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Describe the data you want to extract from the site.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} size="icon">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
