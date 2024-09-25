"use client";

import { Artifact, Messages, Role } from "@/types/export-pipeline";
import React, { createContext, useContext, useState } from "react";

const dummyArtifacts: Artifact[] = [
  {
    id: "dummy",
    type: "dummy",
    name: "Dummy",
    description: "This is a dummy artifact.",
    content: [
      "This is dummy artifact content.",
      "This is dummy artifact content.",
      "This is dummy artifact content.",
      "This is dummy artifact content.",
    ],
  },
  {
    id: "dummy2",
    type: "dummy",
    name: "Dummy2",
    description: "This is a dummy artifact 2.",
    content: [
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
      "This is dummy artifact content 2.",
    ],
  },
];

const dummyMessages: Messages[] = [
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
    artifacts: dummyArtifacts,
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: [
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
    ],
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: [
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
    ],
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: ["Hello, how can I help you today?"],
    createdAt: new Date(),
  },
  {
    role: Role.USER,
    text: "I need help with my website.",
    createdAt: new Date(),
  },
  {
    role: Role.SYSTEM,
    text: [
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
      "Hello, how can I help you today?",
    ],
    createdAt: new Date(),
  },
];

interface ExportContextType {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  messages: Messages[];
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  activeArtifact: Artifact | null;
  setActiveArtifact: React.Dispatch<React.SetStateAction<Artifact | null>>;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function useExportContext() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error("useExportContext must be used within an ExportProvider");
  }
  return context;
}

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Messages[]>(dummyMessages);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(
    dummyArtifacts[0]
  );

  return (
    <ExportContext.Provider
      value={{
        messages,
        setMessages,
        isSubmitting,
        setIsSubmitting,
        activeArtifact,
        setActiveArtifact,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}
