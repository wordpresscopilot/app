"use client";

import { WpSite } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface SelectedSiteContextType {
  selectedSite: WpSite;
  setSelectedSite: Dispatch<SetStateAction<any>>;
}
const SelectedSiteContext = createContext<SelectedSiteContextType | null>(null);

interface SelectedSiteProviderProps {
  children: ReactNode;
}

export const SelectedSiteProvider = ({
  children,
}: SelectedSiteProviderProps) => {
  const [selectedSite, setSelectedSite] = useState(() => {
    const savedSite = sessionStorage.getItem("selectedSite");
    return savedSite ? JSON.parse(savedSite) : null;
  });

  useEffect(() => {
    sessionStorage.setItem("selectedSite", JSON.stringify(selectedSite));
  }, [selectedSite]);

  return (
    <SelectedSiteContext.Provider value={{ selectedSite, setSelectedSite }}>
      {children}
    </SelectedSiteContext.Provider>
  );
};

export const useSelectedSite = () => {
  const context = useContext(SelectedSiteContext);
  if (!context) {
    throw new Error(
      "useSelectedSite must be used within a SelectedSiteProvider"
    );
  }
  return context;
};
