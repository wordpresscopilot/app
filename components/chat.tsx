"use client";

import { ChatPanel } from "@/components/chat-panel";
import { useSelectedSite } from "@/contexts/selected-site";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { Message } from "@/types";
import { useAIState, useUIState } from "ai/rsc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IframePanel } from "./iframe-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  site_id?: string;
  user?: any;
  missingKeys: string[];
}

export function Chat({ id, site_id, className, user, missingKeys }: ChatProps) {
  const { replace, refresh } = useRouter();
  const path = usePathname();
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const { selectedSite } = useSelectedSite();
  const [iframeUrl, setIframeUrl] = useState("https://wordpress.org");
  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    if (user?.id) {
      if (path === `/sites/${site_id}/chat` && messages.length === 1) {
        replace(`/sites/${site_id}/chat/${id}`);
      }
      if (path === `/chat/new` && messages.length === 1) {
        replace(`/sites/${site_id}/chat/${id}`);
      }
    }
  }, [id, path, user, messages, site_id, replace]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      refresh();
    }
  }, [aiState.messages, refresh]);

  useEffect(() => {
    setNewChatId(id);
  });

  useEffect(() => {
    missingKeys.map((key) => {
      toast.error(`Missing ${key} environment variable!`);
    });
  }, [missingKeys]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <>
      <div
        className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
        ref={scrollRef}
      >
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={50} minSize={30}>
            <ChatPanel
              id={id}
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={0} maxSize={70}>
            <IframePanel src={selectedSite?.base_url!} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
