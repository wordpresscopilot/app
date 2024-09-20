"use client";

import { currentSite } from "@/actions/site";
import { WpSite } from "@/types";
import { usePathname } from "next/navigation";
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
  selectedSite: WpSite | null;
  setSelectedSite: Dispatch<SetStateAction<WpSite | null>>;
}
const SelectedSiteContext = createContext<SelectedSiteContextType | null>(null);

interface SelectedSiteProviderProps {
  children: ReactNode;
}

export const SelectedSiteProvider = ({
  children,
}: SelectedSiteProviderProps) => {
  const pathname = usePathname();
  const [selectedSite, setSelectedSite] = useState<WpSite | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      const savedSite = sessionStorage.getItem("selectedSite");
      if (savedSite) {
        setSelectedSite(JSON.parse(savedSite));
      } else {
        const siteIdMatch = pathname.match(/\/sites\/([^\/]+)/);
        if (siteIdMatch) {
          const siteId = siteIdMatch[1];
          const site = (await currentSite(siteId)) as WpSite;
          if (site) {
            setSelectedSite(site);
            sessionStorage.setItem("selectedSite", JSON.stringify(site));
          }
        }
      }
    };

    fetchSite();
  }, [pathname]);

  useEffect(() => {
    if (selectedSite) {
      sessionStorage.setItem("selectedSite", JSON.stringify(selectedSite));
    }
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
