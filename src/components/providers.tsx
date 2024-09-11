"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SelectedSiteProvider } from "@/contexts/selected-site";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>
        <TooltipProvider>
          <SelectedSiteProvider>{children}</SelectedSiteProvider>
        </TooltipProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
