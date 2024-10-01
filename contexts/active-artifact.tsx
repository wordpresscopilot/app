"use client";

import { Artifact } from "@/types/export-pipeline";
import { createContext, ReactNode, useContext, useState } from "react";

interface ActiveArtifactContextType {
  activeArtifact: Artifact | null;
  setActiveArtifact: (artifact: Artifact | null) => void;
}

const ActiveArtifactContext = createContext<ActiveArtifactContextType | null>(
  null
);

export const useActiveArtifact = () => {
  const context = useContext(ActiveArtifactContext);
  if (!context) {
    throw new Error(
      "useActiveArtifact must be used within an ActiveArtifactProvider"
    );
  }
  return context;
};

interface ActiveArtifactProviderProps {
  children: ReactNode;
}

export const ActiveArtifactProvider = ({
  children,
}: ActiveArtifactProviderProps) => {
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);

  return (
    <ActiveArtifactContext.Provider
      value={{ activeArtifact, setActiveArtifact }}
    >
      {children}
    </ActiveArtifactContext.Provider>
  );
};
