"use client";

import { WpSite } from "@/types";
import {
  AssistantRuntimeProvider,
  toLanguageModelMessages,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import {
  AssistantStream,
  DataStreamDecoder,
  toAssistantMessageStream,
} from "assistant-stream";
import { ReactNode } from "react";

export function LocalRuntimeProvider({
  site,
  children,
}: Readonly<{
  children: ReactNode;
  site: WpSite;
}>) {
  const MyModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }) {
      // TODO replace with your own API
      const streamResp = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // forward the messages in the chat to the API
        body: JSON.stringify({
          site,
          messages: toLanguageModelMessages(messages),
        }),
        // if the user hits the "cancel" button or escape keyboard key, cancel the request
        signal: abortSignal,
      });

      const rawAssistantStream = AssistantStream.fromResponse(
        streamResp,
        new DataStreamDecoder()
      );

      const assistantMessageStream =
        toAssistantMessageStream(rawAssistantStream);
      for await (const msg of assistantMessageStream) {
        console.log("msg", msg);
        yield msg;
      }
    },
  };

  const runtime = useLocalRuntime(MyModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
