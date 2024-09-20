import * as React from "react";

import { shareChat } from "@/actions";
import type { AI } from "@/actions/ai";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatShareDialog } from "@/components/chat-share-dialog";
import { PromptForm } from "@/components/prompt-form";
import { Button } from "@/components/ui/button";
import { IconShare } from "@/components/ui/icons";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { cn, nanoid } from "@/lib/utils";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatList } from "./chat-list";
import { EmptyScreen } from "./empty-screen";
import { UserMessage } from "./stocks/message";

export interface ChatPanelProps {
  id?: string;
  title?: string;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({ id, title }: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  const exampleMessages = [
    {
      heading: "Export all",
      subheading: "WordPress posts",
      message: `Can you help me export all WordPress posts from my site?`,
    },
    {
      heading: "Create a new",
      subheading: "blog post",
      message: "I need help creating a new blog post about WordPress SEO tips.",
    },
    {
      heading: "Update theme",
      subheading: "settings",
      message: `How can I update the theme settings to change the color scheme?`,
    },
    {
      heading: "Optimize",
      subheading: `WordPress performance`,
      message: `What are some ways to optimize my WordPress site's performance?`,
    },
  ];

  return (
    <div
      className="relative group w-full h-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] flex flex-col"
      ref={scrollRef}
    >
      <div
        className={cn("flex-grow overflow-y-auto pb-[200px] pt-4 md:pt-10")}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <div className="sticky inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />

        <div className="mb-16 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && "hidden md:block"
                }`}
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>,
                    },
                  ]);

                  const responseMessage = await submitUserMessage(
                    example.message,
                    pathname
                  );

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}

          {messages?.length >= 2 ? (
            <div className="flex h-12 items-center justify-center">
              <div className="flex space-x-2">
                {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        messages: aiState.messages,
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 w-full bg-background border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
        <PromptForm input={input} setInput={setInput} />
      </div>
    </div>
  );
}
