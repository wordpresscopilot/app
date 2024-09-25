"use client";

import { runExtractionPipeline } from "@/actions/extraction-pipeline";
import { ExtractionPipelineFormSchema } from "@/actions/types/extraction-pipeline";
import { WpSite } from "@/types";
import {
  Artifact,
  ArtifactType,
  Messages,
  Role,
  TextContentType,
} from "@/types/export-pipeline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const mockArtifacts: Artifact[] = [
  {
    id: 1,
    type: ArtifactType.TEXT,
    title: "Dummy",
    description: "This is a dummy artifact.",
    content: [
      "This is dummy artifact content.",
      "This is dummy artifact content.",
      "This is dummy artifact content.",
      "This is dummy artifact content.",
    ],
  },
  {
    id: 2,
    type: ArtifactType.TEXT,
    title: "Dummy2",
    description: "This is a dummy artifact 2.",
    content: [
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
    ],
  },
];

const initialMessages: Messages[] = [
  {
    id: 0,
    role: Role.SYSTEM,
    text: [
      {
        title: "Welcome to the Data Export Tool",
        text: "How can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
];

const mockMessages: Messages[] = [
  ...initialMessages,
  {
    id: 1,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    artifacts: mockArtifacts,
    createdAt: new Date(),
  },
  {
    id: 3,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 4,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 5,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 6,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 7,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 8,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 9,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 10,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 11,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 12,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 13,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 14,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 15,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 16,
    role: Role.USER,
    text: [
      {
        text: "I need help with my website.",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 17,
    role: Role.SYSTEM,
    text: [
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
      {
        text: "Hello, how can I help you today?",
        type: TextContentType.TEXT,
      },
    ],
    createdAt: new Date(),
  },
];

interface ExportContextType {
  site: WpSite;
  coreSiteData: any;
  form: UseFormReturn<z.infer<typeof ExtractionPipelineFormSchema>>;
  onSubmit: (data: z.infer<typeof ExtractionPipelineFormSchema>) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Messages[];
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  activeArtifact: Artifact | null;
  setActiveArtifact: React.Dispatch<React.SetStateAction<Artifact | null>>;
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
  const [messages, setMessages] = useState<Messages[]>(mockMessages);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(
    mockArtifacts[0]
  );
  const [error, setError] = useState<string | null>(null);

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
    if (isSubmitting || isGenerating) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        role: Role.USER,
        text: [
          {
            text: data.userRequest,
            type: TextContentType.TEXT,
          },
        ],
        createdAt: new Date(),
      },
    ]);

    form.setValue("userRequest", "");

    setIsSubmitting(true);
    setIsGenerating(true);
    setError(null);

    try {
      const result = await runExtractionPipeline({
        userRequest: data.userRequest,
        coreSiteData: data.coreSiteData,
        wpSite: data.wpSite,
      });

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            role: Role.SYSTEM,
            text: [
              {
                text: "Here's what I found:",
                type: TextContentType.TEXT,
              },
              {
                title: "Explanation",
                text: result.explanation || "-",
                type: TextContentType.TEXT,
              },
            ],
            artifacts: [
              {
                id: 3,
                title: "Query",
                description:
                  "Click to see the SQL query used to extract the data.",
                type: ArtifactType.SQL,
                content: [result.query || "-"],
              },
              {
                id: 4,
                title: "Result",
                description: "Click to see the JSON result of the extraction.",
                type: ArtifactType.JSON_TABLE,
                content: [result.data || "-"],
              },
            ],
            createdAt: new Date(),
          },
        ]);

        setError(null);
      } else {
        setError(result.error || "An error occurred during extraction.");
      }
    } catch (error) {
      setError("An unexpected error occurred during extraction.");
    } finally {
      setIsSubmitting(false);
      setIsGenerating(false);
    }
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
        isSubmitting,
        setIsSubmitting,
        isGenerating,
        setIsGenerating,
        activeArtifact,
        setActiveArtifact,
        error,
        setError,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}
