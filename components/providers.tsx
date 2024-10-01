"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SelectedSiteProvider } from "@/contexts/selected-site";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST!;

  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: "always", // or 'always' to create profiles for anonymous users as well || identified_only for identified users only
  });
}

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <PostHogProvider client={posthog}>
      <NextThemesProvider {...props} defaultTheme="dark">
        <SidebarProvider>
          <TooltipProvider>
            <SelectedSiteProvider>{children}</SelectedSiteProvider>
          </TooltipProvider>
        </SidebarProvider>
      </NextThemesProvider>
    </PostHogProvider>
  );
}
