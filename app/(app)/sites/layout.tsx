"use client";

import { Header } from "@/components/header";
import { ActiveArtifactProvider } from "@/contexts/active-artifact";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = false;
  // const { isSidebarOpen } = useSidebar();
  const { isAboveLg } = useBreakpoint("lg");

  return (
    <>
      <ActiveArtifactProvider>
        <Header />
        <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
          {/* <SidebarDesktop /> */}
          <div
            className={cn(
              "w-full",
              isSidebarOpen &&
                isAboveLg &&
                "translate-x-[250px] w-[calc(100%-250px)]",
              "transition-transform duration-300 ease-in-out"
            )}
          >
            {children}
          </div>
        </div>
      </ActiveArtifactProvider>
    </>
  );
}
