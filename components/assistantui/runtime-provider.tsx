"use client";

import { WpSite } from "@/types";
import {
  AppendMessage,
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  makeAssistantTool,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  ThreadMessageLike,
  useEdgeRuntime,
  WebSpeechSynthesisAdapter,
} from "@assistant-ui/react";
import { TerminalIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";
import { ArtifactsView } from "../ui/assistant-ui/artifacts-view";
import { WebSearchToolUI } from "../ui/assistant-ui/web-search-tool-ui";

const convertMessage = (message: ThreadMessageLike) => {
  return message;
};

const RenderHTMLTool = makeAssistantTool({
  toolName: "render_html",
  description:
    "Whenever the user asks for HTML code, call this function. The user will see the HTML code rendered in their browser.",
  parameters: z.object({
    code: z.string(),
  }),
  execute: async () => {
    return {};
  },
  render: () => {
    return (
      <div className="border rounded-full px-4 py-2 -mt-2 bg-black text-white inline-flex items-center gap-2">
        <TerminalIcon className="size-4" />
        render_html({"{"} code: &quot;...&quot; {"}"})
      </div>
    );
  },
});

export function RuntimeProvider({
  site,
  coreSiteData,
  children,
}: Readonly<{
  site: WpSite;
  coreSiteData: any;
  children: React.ReactNode;
}>) {
  const threadIdRef = useRef<string | undefined>();
  const params = useSearchParams();
  const threadId = params.get("threadId") ?? undefined;
  const [messages, setMessages] = useState<ThreadMessageLike[]>([]);

  const onNew = async (message: AppendMessage) => {
    if (message.content.length !== 1 || message.content[0]?.type !== "text")
      throw new Error("Only text content is supported");

    const userMessage: ThreadMessageLike = {
      role: "user",
      content: [{ type: "text", text: message.content[0].text }],
    };
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    // normally you would perform an API call here to get the assistant response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const assistantMessage: ThreadMessageLike = {
      role: "assistant",
      content: [{ type: "text", text: "Hello, world!" }],
    };
    setMessages((currentMessages) => [...currentMessages, assistantMessage]);
  };

  // const runtime = useVercelRSCRuntime({ messages, onNew });

  const runtime = useEdgeRuntime({
    api: "/api/chat",
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
      <RenderHTMLTool />
      <ArtifactsView />
      <WebSearchToolUI />
    </AssistantRuntimeProvider>
  );
}
