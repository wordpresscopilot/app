"use client";

import { Header } from "@/components/header";
import { SidebarDesktop } from "@/components/sidebar-desktop";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useSidebar();

  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <SidebarDesktop />
        <div
          className={cn(
            "w-full overflow-y-auto",
            isSidebarOpen && "translate-x-[250px] w-[calc(100%-250px)]",
            "transition-transform duration-300 ease-in-out"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
