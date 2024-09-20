"use client";

import { ChatHistory } from "@/components/chat-history";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@clerk/clerk-react";

export function SidebarDesktop() {
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex w-[250px]">
      {/* @ts-ignore */}
      {/* <WpSiteStatus userId={user?.id} /> */}
      <ChatHistory userId={userId} />
    </Sidebar>
  );
}
