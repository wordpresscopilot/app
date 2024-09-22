"use client";

import { ChatList } from "@/components/chat-list";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { cn } from "@/lib/utils";
import { Message, Plugin } from "@/types";
import { useAIState, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PluginPromptForm } from "./plugin-prompt-form";
export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  missingKeys: string[];
  user: any;
  plugin: Plugin;
}

export function PluginChat({
  id,
  className,
  user,
  missingKeys,
  plugin,
}: ChatProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    missingKeys.map((key) => {
      toast.error(`Missing ${key} environment variable!`);
    });
  }, [missingKeys]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      // ref={scrollRef}
    >
      <div className={cn("pb-[200px]", className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          // <EmptyScreen />
          <></>
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <div className="bg-white w-full pt-4 fixed bottom-0 left-0 right-0 mx-auto sm:max-w-2xl sm:px-4">
        <div className="grid gap-4 sm:pb-4">
          <PluginPromptForm input={input} setInput={setInput} plugin={plugin} />
          <p
            className={cn(
              "px-2 text-center text-xs leading-normal text-zinc-500"
            )}
          >
            Please do not send sensitive information.
          </p>
        </div>
      </div>
    </div>
  );
}
