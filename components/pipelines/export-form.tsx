"use client";

import { useExportContext } from "@/components/pipelines/provider";
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
import { ArrowUp, Loader2 } from "lucide-react";

export default function ExportForm() {
  const { isSubmitting, isGenerating, form, onSubmit } = useExportContext();

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
          <Button
            type="submit"
            disabled={isSubmitting || isGenerating}
            size="icon"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
