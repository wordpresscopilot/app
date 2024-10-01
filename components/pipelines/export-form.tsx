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
import { Loader2, SendHorizonalIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
export default function ExportForm() {
  const { isSubmitting, isGenerating, form, onSubmit } = useExportContext();

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form.getValues());
        }}
      >
        <div className="relative">
          <FormField
            control={form.control}
            name="userRequest"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Write a message..."
                      className="min-h-[52px] max-h-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSubmit(form.getValues());
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || isGenerating}
                      size="icon"
                      className="absolute right-2 bottom-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <SendHorizonalIcon />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Describe the data you want to extract from the site.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
