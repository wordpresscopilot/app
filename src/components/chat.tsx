"use client";

import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { useSelectedSite } from "@/contexts/selected-site";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { useAIState, useUIState } from "ai/rsc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  site_id?: string;
  user?: any;
  missingKeys: string[];
}

export function Chat({ id, site_id, className, user, missingKeys }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const { selectedSite } = useSelectedSite();

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    if (user?.id) {
      if (path === `/sites/${site_id}/chat` && messages.length === 1) {
        window.history.replaceState({}, "", `/sites/${site_id}/chat/${id}`);
      }
      if (path === `/chat/new` && messages.length === 1) {
        window.history.replaceState({}, "", `/sites/${site_id}/chat/${id}`);
      }
    }
  }, [id, path, user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

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
        {!selectedSite?.connected && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span>
              Warning: The AI Agent is unable to connect to your WordPress site.
            </span>
          </div>
        )}
        <div
          className={cn("pb-[200px] pt-4 md:pt-10", className)}
          ref={messagesRef}
        >
          {messages.length ? (
            <ChatList messages={messages} isShared={false} user={user} />
          ) : (
            <EmptyScreen />
          )}
          <div className="w-full h-px" ref={visibilityRef} />
        </div>
        <ChatPanel
          id={id}
          input={input}
          setInput={setInput}
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </>
  );
}
