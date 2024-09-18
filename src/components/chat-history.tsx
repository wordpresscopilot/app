"use client";

import * as React from "react";

interface ChatHistoryProps {
  userId?: string;
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  // const { selectedSite } = useSelectedSite();
  return (
    <div className="flex flex-col h-full">
      {/* <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div
            className={`h-3 w-3 rounded-full ${
              selectedSite?.plugin_connected ? "bg-green-500" : "bg-red-500"
              // : "bg-yellow-500 animate-pulse"
            }`}
          />
          <span className="text-sm font-medium">
            {selectedSite?.plugin_connected
              ? "Site Connected"
              : "Site Disconnected"}
          </span>
        </div>
      </div> */}
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">Chat History</h4>
      </div>
      <div className="mb-2 px-2">
        {/* <Link
          href={`/sites/${selectedSite?.id}/chat`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
          )}
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          New Chat
        </Link> */}
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        {/* <SidebarList userId={userId} siteId={selectedSite?.id} /> */}
      </React.Suspense>
    </div>
  );
}
