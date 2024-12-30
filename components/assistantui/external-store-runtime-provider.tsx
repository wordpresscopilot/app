"use client";
import { nanoid } from "@/lib/utils";
import { WpSite } from "@/types";
import { Message, Role } from "@/types/export-pipeline";
import {
  AppendMessage,
  AssistantRuntimeProvider,
  ThreadMessageLike,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import {
  AssistantStream,
  DataStreamDecoder,
  toAssistantMessageStream,
} from "assistant-stream";
import { ReactNode, useState } from "react";

const convertMessage = (message: Message): ThreadMessageLike => {
  //   const artifact_messages = message?.artifacts!.map((artifact) => {});

  return {
    id: message.id,
    role: message.role === Role.USER ? "user" : "assistant",
    content: [{ type: "text", text: message.text?.[0]?.text }].filter(
      Boolean
    ) as any,
  };
};

export const sliceMessagesUntil = (
  messages: Message[],
  messageId: string | null
) => {
  if (messageId == null) return [];

  let messageIdx = messages.findIndex((m) => m.id === messageId);
  if (messageIdx === -1) throw new Error();

  return messages.slice(0, messageIdx + 1);
};

export function CustomExternalStoreRuntimeProvider({
  children,
  site,
}: Readonly<{
  children: ReactNode;
  site: WpSite;
}>) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const runNewMessageOnPipeline = async (msgs: Message[]) => {
    const streamResp = await fetch("/api/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: msgs }),
    });

    const rawAssistantStream = AssistantStream.fromResponse(
      streamResp,
      new DataStreamDecoder()
    );

    const assistantMessageStream = toAssistantMessageStream(rawAssistantStream);
    for await (const msg of assistantMessageStream) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        if (lastIndex >= 0 && updatedMessages[lastIndex].id === msg.id) {
          // Update the existing message
          updatedMessages[lastIndex] = msg;
        } else {
          // Add the new message
          updatedMessages.push(msg);
        }

        return updatedMessages;
      });
    }
    // toLanguageModelMessages(message);
    //   const { steps, toolCalls, responseMessages, combinedMessages } =
    //     await runWPSiteAgent({
    //       site,
    //       messages: msgs,
    //     });
    // console.log("combinedMessages", combinedMessages);
    // if (combinedMessages.length > 0) {
    //   const newMessages = combinedMessages
    //     .map((m) => {
    //       const item = m.content?.[0];
    //       const toolName = item?.toolName;
    //       const description = item?.args?.description || item?.args?.answer;
    //       const isError = Boolean(
    //         item?.result?.error || toolName === ToolType.ERROR
    //       );
    //       const title = `${isError ? "Error: " : ""}${item?.args?.title}`;

    //       const result =
    //         typeof item?.result === "object"
    //           ? JSON.stringify(item?.result)
    //           : item?.result || "";

    //       const artifact = {
    //         id: nanoid(),
    //         title,
    //         isError,
    //       } as Artifact;

    //       switch (toolName) {
    //         case ToolType.GET_CURRENT_SITE_PLUGINS:
    //           artifact.type = ArtifactType.JSON_TABLE;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.GET_CURRENT_SITE_PLUGINS;
    //           break;
    //         case ToolType.GET_CORE_SITE_DATA:
    //           artifact.type = ArtifactType.JSON_TABLE;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.GET_CORE_SITE_DATA;
    //           break;
    //         case ToolType.SEARCH_PLUGINS:
    //           artifact.type = ArtifactType.JSON_TABLE;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.SEARCH_PLUGINS;
    //           break;
    //         case ToolType.RUN_SQL_QUERY:
    //           artifact.type = ArtifactType.JSON_TABLE;
    //           artifact.title = description;
    //           artifact.description = item?.args?.query;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.RUN_SQL_QUERY;
    //           break;
    //         case ToolType.ANSWER:
    //           artifact.type = ArtifactType.TEXT;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [JSON.stringify(item.args.steps as any)];
    //           artifact.toolName = ToolType.ANSWER;
    //           break;
    //         case ToolType.ERROR:
    //           artifact.type = ArtifactType.TEXT;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [];
    //           artifact.toolName = ToolType.ERROR;
    //           break;
    //         case ToolType.ASK_FOR_PERMISSION:
    //           artifact.type = ArtifactType.BUTTONS;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.toolName = ToolType.ASK_FOR_PERMISSION;
    //           break;
    //         case ToolType.INSTALL_PLUGIN:
    //           artifact.type = ArtifactType.TEXT;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.INSTALL_PLUGIN;
    //           break;
    //         case ToolType.REMOVE_PLUGIN:
    //           artifact.type = ArtifactType.TEXT;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [result];
    //           artifact.toolName = ToolType.REMOVE_PLUGIN;
    //           break;
    //         case ToolType.GENERATE_PAGE:
    //           artifact.type = ArtifactType.CODE;
    //           artifact.title = title;
    //           artifact.description = description;
    //           artifact.content = [
    //             JSON.stringify({
    //               prompt: item.args.prompt,
    //               plugin_name: item.result.plugin_name,
    //               plugin_file_content: item.result.plugin_file_content,
    //               page_path: item.result.page_path,
    //             }),
    //           ];
    //           artifact.toolName = ToolType.GENERATE_PAGE;
    //           break;
    //         // Add more cases for other tool types as needed
    //       }
    //       // if (m.toolName === ToolType.GET_CURRENT_SITE_PLUGINS) {

    //       // type: ArtifactType.JSON_TABLE,
    //       // content: [JSON.stringify(curr.result)],
    //       // toolName: ToolType.GET_CURRENT_SITE_PLUGINS,
    //       const content = [
    //         {
    //           type: TextContentType.TEXT,
    //           text: description,
    //         },
    //       ] as Content[];
    //       const artifacts =
    //         artifact.toolName !== ToolType.ANSWER ? [artifact] : [];
    //       return {
    //         id: nanoid(),
    //         role: Role.ASSISTANT,
    //         content,
    //         text: content,
    //         artifacts,
    //         createdAt: new Date(),
    //         isError,
    //       };
    //     })
    //     .filter(Boolean) as Message[];
    //   console.log("Fully combinedMessages", [...msgs, ...newMessages]);
    //   const newConversation = [...msgs, ...newMessages] as Message[];
    //   console.log("newConversation2", newConversation);
    //   setMessages(newConversation);
    // }
    // if (responseMessages.length > 0) {
    //   console.log("toolCalls", toolCalls);
    //   console.log("steps", steps);
    //   console.log("responseMessages", responseMessages);

    //   const newMessages = responseMessages
    //     .map((m) => {
    //       let artifacts: Artifact[] = [];
    //       const newMessageContent = m.content.reduce((prev, curr) => {
    //         if (curr.type === "text" && curr.text.length > 0) {
    //           prev.push({
    //             type: TextContentType.TEXT,
    //             text: curr.text,
    //           });
    //         }
    //         if (curr.type === "tool-call") {
    //           if (curr.toolName === "answer") {
    //             prev.push({
    //               type: TextContentType.TEXT,
    //               text: curr.args.answer,
    //             });
    //           } else {
    //             prev.push({
    //               type: TextContentType.TEXT,
    //               text: `Tool call: ${curr.toolName}`,
    //             });
    //           }

    //           return prev;
    //         }
    //         if (curr.type === "tool-result") {
    //           if (curr.toolName === "getCurrentSitePlugins") {
    //             prev.push({
    //               type: TextContentType.TEXT,
    //               text: "Tool result: getCurrentSitePlugins",
    //             });
    //             artifacts.push({
    //               id: nanoid(),
    //               title: "Site Plugins",
    //               type: ArtifactType.JSON_TABLE,
    //               content: [JSON.stringify(curr.result)],
    //               toolName: ToolType.GET_CURRENT_SITE_PLUGINS,
    //             });
    //           } else if (curr.toolName === "runSQLQuery") {
    //             artifacts.push({
    //               id: nanoid(),
    //               title: "Table Query Results",
    //               type: ArtifactType.JSON_TABLE,
    //               content: curr.result,
    //               toolName: ToolType.RUN_SQL_QUERY,
    //             });
    //           }
    //         }
    //         return prev;
    //       }, []) as Content[];
    //       if (newMessageContent.length === 0) return;

    //       return {
    //         id: nanoid(),
    //         role: Role.ASSISTANT,
    //         content: newMessageContent,
    //         text: newMessageContent,
    //         artifacts,
    //         createdAt: new Date(),
    //       };
    //     })
    //     .filter(Boolean) as Message[];
    //   console.log("newMessages", newMessages);
    //   const newConversation = [...msgs, ...newMessages] as Message[];
    //   console.log("newConversation22", newConversation);
    //   // setMessages(newConversation);
    // }
  };

  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== "text")
      throw new Error("Only text messages are supported");

    const input = message.content[0].text;
    let newConversation = [
      ...messages,
      {
        id: nanoid(),
        role: Role.USER,
        content: [{ text: input, type: "text" }],
        text: [{ text: input, type: "text" }],
        createdAt: new Date(),
      },
    ] as Message[];
    setMessages(newConversation);
    setIsRunning(true);
    try {
      await runNewMessageOnPipeline(newConversation);
      setIsRunning(false);
    } catch (e) {
      console.log("error", e);
      setIsRunning(false);
    }

    // setMessages((messages: any) => {
    //   return [
    //     ...messages,
    //     {
    //       id: nanoid(),
    //       role: Role.ASSISTANT,
    //       text: [{ text: JSON.stringify(aiObjResult), type: "text" }],
    //       createdAt: new Date(),
    //     },
    //   ];
    // });
  };

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,

    setMessages: (messages) => {
      setMessages(messages);
    },
    convertMessage,
    onNew,
    onEdit: (m) => {
      const prevMessages = sliceMessagesUntil(messages, m.parentId);
      setMessages(prevMessages);
      return onNew(m);
    },
    onReload: async (parentId) => {
      const prevMessages = sliceMessagesUntil(messages, parentId);
      setMessages(prevMessages);
      setIsRunning(true);
      try {
        await runNewMessageOnPipeline(prevMessages);
        setIsRunning(false);
      } catch (e) {
        console.log("error", e);
        setIsRunning(false);
      }
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
