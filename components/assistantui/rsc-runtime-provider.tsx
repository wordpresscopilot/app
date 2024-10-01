"use client";

import { AI } from "@/actions/assistantui";
import { nanoid } from "@/lib/utils";
import { WpSite } from "@/types";
import {
  AppendMessage,
  AssistantRuntimeProvider,
  makeAssistantTool,
  ThreadMessageLike,
} from "@assistant-ui/react";
import { useVercelRSCRuntime } from "@assistant-ui/react-ai-sdk";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { TerminalIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { z } from "zod";
import { ArtifactsView } from "../ui/assistant-ui/artifacts-view";

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

export function RSCRuntimeProvider({
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
  const { continueConversation } = useActions();
  const [messages, setMessages] = useUIState<typeof AI>();

  useAIState();

  const onNew = async (m: AppendMessage) => {
    console.log("onNew", m);
    console.log("coreSiteData");
    if (m.content[0]?.type !== "text")
      throw new Error("Only text messages are supported");

    const input = m.content[0].text;
    setMessages((currentConversation) => [
      ...currentConversation,
      { id: nanoid(), role: "user", display: input },
    ]);

    const message = await continueConversation(input, site);
    console.log("recieved message", message);

    setMessages((currentConversation) => [...currentConversation, message]);
  };

  const onEdit = async (m: AppendMessage) => {
    console.log("onNew", m);
    console.log("coreSiteData");
    if (m.content[0]?.type !== "text")
      throw new Error("Only text messages are supported");

    const input = m.content[0].text;
    setMessages((currentConversation) => [
      ...currentConversation,
      { id: nanoid(), role: "user", display: input },
    ]);

    const message = await continueConversation(input, site);
    console.log("recieved message", message);

    setMessages((currentConversation) => [...currentConversation, message]);
  };

  const runtime = useVercelRSCRuntime({ messages, onNew, onEdit });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
      <ArtifactsView />
      {/* <RenderHTMLTool />
      
      <WebSearchToolUI /> */}
    </AssistantRuntimeProvider>
  );
}
