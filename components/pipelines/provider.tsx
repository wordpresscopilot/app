"use client";

import { ExtractionPipelineFormSchema } from "@/actions/types/extraction-pipeline";
import { nanoid } from "@/lib/utils";
import { WpSite } from "@/types";
import { Artifact, Message } from "@/types/export-pipeline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActions, useAIState, useUIState } from "ai/rsc";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UserMessage } from "./messages-ui";

interface ExportContextType {
  site: WpSite;
  coreSiteData: any;
  form: UseFormReturn<z.infer<typeof ExtractionPipelineFormSchema>>;
  onSubmit: (data: z.infer<typeof ExtractionPipelineFormSchema>) => void;
  messages: any;
  setMessages: React.Dispatch<React.SetStateAction<any>>;
  aiState: any;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  activeArtifact: Artifact;
  setActiveArtifact: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function useExportContext() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error("useExportContext must be used within an ExportProvider");
  }
  return context;
}

export function ExportProvider({
  children,
  site,
  coreSiteData,
}: {
  children: React.ReactNode;
  site: WpSite;
  coreSiteData: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact>();
  const [error, setError] = useState<string | null>(null);
  const { submitUserMessage } = useActions();
  const [messages, setMessages] = useUIState();
  const [aiState] = useAIState();

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
    console.log("clicked onsubmit");
    // if (isSubmitting || isGenerating) return;
    setMessages((currentMessages: Message[]) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage content={data?.userRequest} />,
      },
    ]);

    setIsSubmitting(true);
    setIsGenerating(true);
    setError(null);

    const response = await submitUserMessage(data.userRequest, site?.id);
    setIsSubmitting(response.loading);
    setIsGenerating(response.loading);

    await setMessages((currentMessages: Message[]) => [
      ...currentMessages,
      response,
    ]);
    form.setValue("userRequest", "");

    // try {
    //   const result = await runExtractionPipeline({
    //     userRequest: data.userRequest,
    //     coreSiteData: data.coreSiteData,
    //     wpSite: data.wpSite,
    //   });

    //   if (result.success) {
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         id: prev.length,
    //         role: Role.SYSTEM,
    //         text: [
    //           {
    //             text: "Here's what I found:",
    //             type: TextContentType.TEXT,
    //           },
    //           {
    //             title: "Explanation",
    //             text: result.explanation || "-",
    //             type: TextContentType.TEXT,
    //           },
    //         ],
    //         artifacts: [
    //           {
    //             id: 3,
    //             title: "Query",
    //             description:
    //               "Click to see the SQL query used to extract the data.",
    //             type: ArtifactType.SQL,
    //             content: [result.query || "-"],
    //           },
    //           {
    //             id: 4,
    //             title: "Result",
    //             description: "Click to see the JSON result of the extraction.",
    //             type: ArtifactType.JSON_TABLE,
    //             content: [result.data || "-"],
    //           },
    //         ],
    //         createdAt: new Date(),
    //       },
    //     ]);

    //     setError(null);
    //   } else {
    //     setError(result.error || "An error occurred during extraction.");
    //   }
    // } catch (error) {
    //   setError("An unexpected error occurred during extraction.");
    // } finally {
    //   setIsSubmitting(false);
    //   setIsGenerating(false);
    // }
    setIsSubmitting(false);
    setIsGenerating(false);
    // console.log("response.loading", response.loading);
    // await setIsSubmitting(response.loading);
    // await setIsGenerating(response.loading);
  };

  return (
    <ExportContext.Provider
      value={{
        site,
        coreSiteData,
        form,
        onSubmit,
        messages,
        setMessages,
        aiState,
        isSubmitting,
        setIsSubmitting,
        isGenerating,
        setIsGenerating,
        activeArtifact: activeArtifact ?? ({} as Artifact),
        setActiveArtifact: setActiveArtifact as Dispatch<
          SetStateAction<Artifact | undefined>
        >,
        error,
        setError,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}
