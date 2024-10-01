"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { WpSite } from "@/types";
import { Message } from "@/types/export-pipeline";
import { useAIState } from "ai/rsc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExportUI } from "../pipelines";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  user?: any;
  site: WpSite;
  coreSiteData: any;
}

export function Chat({ id, className, user, site, coreSiteData }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [aiState] = useAIState();

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <ExportUI site={site} coreSiteData={coreSiteData} />;
    </div>
  );
}
