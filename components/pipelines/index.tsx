"use client";

import { ExportProvider } from "@/components/pipelines/provider";
import { WpSite } from "@/types";
import { Message } from "@/types/export-pipeline";
import {
  AppendMessage,
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { useState } from "react";
import { ArtifactUI } from "./artifact-ui";
import ExportForm from "./export-form";
import { MessagesUI } from "./messages-ui";

export function ExportUI({
  site,
  coreSiteData,
}: {
  site: WpSite;
  coreSiteData: any;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const convertMessage = (message: Message): any => {
    return {
      role: message.role,
      content: [{ type: "text", text: message.content }],
    };
  };

  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== "text")
      throw new Error("Only text messages are supported");

    const input = message.content[0].text;
    setMessages((currentConversation: any) => [
      ...currentConversation,
      { role: "user", content: input },
    ]);

    setIsRunning(true);
    // const assistantMessage = await backendApi(input);
    // setMessages((currentConversation) => [
    //   ...currentConversation,
    //   assistantMessage,
    // ]);
    setIsRunning(false);
  };

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage,
    onNew,
  });

  return (
    <ExportProvider site={site} coreSiteData={coreSiteData}>
      <AssistantRuntimeProvider runtime={runtime}>
        {/* <MyThread /> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full max-h-full overflow-hidden">
          <div className="relative col-span-1 h-full h-[calc(100vh-100px)] flex flex-col">
            <MessagesUI />
            {/* <div className="h-[96px] max-h-[96px] absolute bottom-0 left-0 right-0 bg-muted backdrop-brightness-25 rounded-t-lg border-t-2 border-l-2 border-r-2 border-border p-4 drop-shadow-lg"> */}
            <div className="sticky bottom-0 mt-4 flex w-full max-w-2xl flex-grow flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
              <ExportForm />
            </div>
            {/* </div> */}
          </div>
          <div className="col-span-1 p-4 pl-0 max-h-[calc(100vh-64px)] overflow-y-auto">
            <ArtifactUI />
          </div>
        </div>
      </AssistantRuntimeProvider>
    </ExportProvider>
  );
}
