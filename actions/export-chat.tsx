// @ts-nocheck
"use server";

import { BotCard, BotMessage, UserMessage } from "@/components/stocks/message";
import { CodeBlock } from "@/components/ui/codeblock";
import prisma from "@/lib/prisma";
import { nanoid } from "@/lib/utils";
import { AIState, Chat, UIState, WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import {
  createAI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";

import { currentSite } from "@/data/site";
import { AI_TOOL_EXECUTE_SQL_COMMAND } from "@/lib/constants";
import { AI } from "./ai";
import { categorizeRequest, verifyHasPermissions } from "./extraction-pipeline";

async function submitUserMessage(user_message: string, siteId: string) {
  ("use server");
  const site = (await currentSite(siteId)) as WpSite;
  const aiState = getMutableAIState<typeof AI>();
  await aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: user_message || "",
      },
    ],
  });
  console.log("submitUserMessage", user_message);
  let textStream: ReturnType<typeof createStreamableValue<string>> =
    createStreamableValue();

  let textNode: undefined | React.ReactNode;

  const request_category = await categorizeRequest({
    user_request: user_message,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content || "", // Ensure content is never null
        name: message.name,
      })),
    ],
  });
  console.log(
    "request_category.object.category",
    request_category.object.category
  );
  textStream.update(request_category.object.category);
  textStream.done();
  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "assistant",
        content: request_category.object.category || "",
      },
    ],
  });
  // textNode = <BotMessage content={textStream.value} />;

  if (request_category.object.category === "data_extraction") {
    //       textStream = createStreamableValue("");
    //       textNode = <BotMessage content={textStream.value} />;
    //     }
    //     if (done) {
    //       textStream.done();
    //       aiState.done({
    //         ...aiState.get(),
    //         messages: [
    //           ...aiState.get().messages,
    //           {
    //             id: nanoid(),
    //             role: "assistant",
    //             content: content || "",
    //           },
    //         ],
    //       });
    //     } else {
    //       textStream.update(delta);
    //     }
  }
  return textNode;

  const hasPermissions = await verifyHasPermissions({ site });
  console.log("hasPermissions", hasPermissions);
  if (request_category.object.category === "data_extraction") {
  }

  // const result = await streamUI({
  //   model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-3.5-turbo"),
  //   initial: <SpinnerMessage />,
  //   system: `\
  //   You are an AI assistant for WordPress site management and development. You help users with tasks related to developing their WordPress site.

  //   You have the ability to:
  //   1. execute SQL queries on the WordPress database to assist users.
  //   2. execute bash scripts on the WordPress server from the public_html/ directory to retrieve output from the remote server for further processing. Bias to use the wp cli tool.

  //   If the user asks for something that requires many tasks, you can run multiple sql or bash commands in one script to complete the task.

  //   Use wp cli or sql commands to solve the problem.

  //   Always prioritize security and best practices. Never do anything or run any command which will harm the database, server, or the site.
  //   `,
  //   // When a user requests a task or asks about a solution, analyze it carefully and ask clarifying questions to understand what must be done and offer a solution when you have one that works.
  //   // If you need more information for a task, better to tell the user and do an initial task and allow the user to ask you to do the rest.

  //   //     1. Launch an agent capable of multi step tasks which can execute both SQL and SSH commands, and modify the WordPress site in a complex way.
  //   //     If the users request requires multiple steps, launch an agent tool to execute the tasks in sequence.

  //   messages: [
  //     ...aiState.get().messages.map((message: any) => ({
  //       role: message.role,
  //       content: message.content || "", // Ensure content is never null
  //       name: message.name,
  //     })),
  //   ],
  //   text: ({ content, done, delta }) => {
  //     if (!textStream) {
  //       textStream = createStreamableValue("");
  //       textNode = <BotMessage content={textStream.value} />;
  //     }

  //     if (done) {
  //       textStream.done();
  //       aiState.done({
  //         ...aiState.get(),
  //         messages: [
  //           ...aiState.get().messages,
  //           {
  //             id: nanoid(),
  //             role: "assistant",
  //             content: content || "",
  //           },
  //         ],
  //       });
  //     } else {
  //       textStream.update(delta);
  //     }
  //     return textNode;
  //   },
  //   tools: {
  //     [AI_TOOL_EXECUTE_SQL_COMMAND]: {
  //       description: "Execute SQL query on the WordPress database.",
  //       parameters: z.object({
  //         query: z.string().describe("The SQL query to execute"),
  //       }),
  //       generate: async function* ({ query }) {
  //         yield (
  //           <>
  //             {textNode}
  //             <BotCard>
  //               <BotMessage
  //                 content={`Executing SQL query: ${query}`}
  //                 showAvatar={false}
  //               />
  //               <CodeExecutionSkeleton />
  //             </BotCard>
  //           </>
  //         );

  //         const api_url = new URL(WP_PATH_RUN_SQL, site?.base_url).toString();
  //         const { status, ok, data, error } = await executeWordPressSQL({
  //           query,
  //           api_key: site?.api_key,
  //           api_url,
  //         });
  //         console.log({ status, ok, data, error });
  //         const toolCallId = nanoid();
  //         aiState.done({
  //           ...aiState.get(),
  //           messages: [
  //             ...aiState.get().messages,
  //             {
  //               id: nanoid(),
  //               role: "assistant",
  //               content: [
  //                 {
  //                   type: "tool-call",
  //                   toolName: AI_TOOL_EXECUTE_SQL_COMMAND,
  //                   toolCallId,
  //                   args: { query },
  //                 },
  //               ],
  //             },
  //             {
  //               id: nanoid(),
  //               role: "tool",
  //               content: [
  //                 {
  //                   type: "tool-result",
  //                   toolName: AI_TOOL_EXECUTE_SQL_COMMAND,
  //                   toolCallId,
  //                   result: data,
  //                 },
  //               ],
  //             },
  //           ],
  //         });

  //         return (
  //           <>
  //             {textNode}
  //             <BotCard>
  //               <div className="p-4 w-full flex flex-col gap-2 items-start justify-start">
  //                 <ToolCommandCard command={`${query}`} />
  //                 <div className="max-w-3xl overflow-x-scroll">
  //                   <JSONArrayTable data={data} />
  //                 </div>
  //               </div>
  //             </BotCard>
  //           </>
  //         );
  //       },
  //     },
  //     [AI_TOOL_EXECUTE_SSH_COMMAND]: {
  //       description:
  //         "Execute SSH script on a wordpress server which has within the public_html/ directory to retrieve output from the remote server for further processing. The server is setup with all standard wordpress cli tools.",
  //       parameters: z.object({
  //         bash_script: z
  //           .string()
  //           .describe(
  //             "The bash script to execute on the wordpresss server from the public_html/ directory"
  //           ),
  //       }),
  //       generate: async function* ({ bash_script }) {
  //         yield (
  //           <>
  //             {textNode}
  //             <BotCard>
  //               <BotMessage
  //                 content={`Executing Bash script: ${bash_script}`}
  //                 showAvatar={false}
  //               />
  //               <SpinnerMessage />
  //             </BotCard>
  //           </>
  //         );
  //         const sshClient = new SSHProxyClient();
  //         const toolCallId = nanoid();
  //         try {
  //           const connectionOutput = await sshClient.connect(
  //             site?.ssh?.host!,
  //             site?.ssh?.port || 22,
  //             site?.ssh?.username!,
  //             site?.ssh?.password!,
  //             site?.ssh?.wp_root_dir_path!
  //           );
  //           yield (
  //             <>
  //               {textNode}
  //               <BotCard>
  //                 <BotMessage
  //                   content="SSH Connection Established"
  //                   showAvatar={false}
  //                 />
  //                 <div className={"group relative flex items-start"}>
  //                   <div className="flex-1 space-y-2 overflow-hidden">
  //                     <CodeBlock
  //                       language="text"
  //                       value={String(connectionOutput)}
  //                     />
  //                   </div>
  //                 </div>
  //               </BotCard>
  //             </>
  //           );
  //           const output = await sshClient.executeCommand(bash_script);
  //           aiState.done({
  //             ...aiState.get(),
  //             messages: [
  //               ...aiState.get().messages,
  //               {
  //                 id: nanoid(),
  //                 role: "assistant",
  //                 content: [
  //                   {
  //                     type: "tool-call",
  //                     toolName: AI_TOOL_EXECUTE_SSH_COMMAND,
  //                     toolCallId,
  //                     args: { bash_script },
  //                   },
  //                 ],
  //               },
  //               {
  //                 id: nanoid(),
  //                 role: "tool",
  //                 content: [
  //                   {
  //                     type: "tool-result",
  //                     toolName: AI_TOOL_EXECUTE_SSH_COMMAND,
  //                     toolCallId,
  //                     result: output,
  //                   },
  //                 ],
  //               },
  //             ],
  //           });

  //           await sshClient.disconnect();

  //           return (
  //             <>
  //               {textNode}
  //               <BotCard>
  //                 <BotMessage content={`${bash_script}`} showAvatar={false} />
  //                 <div className={"group relative flex items-start"}>
  //                   <div className="flex-1 space-y-2 overflow-hidden">
  //                     <CodeBlock language="text" value={output} />
  //                   </div>
  //                 </div>
  //               </BotCard>
  //             </>
  //           );
  //         } catch (error) {
  //           return (
  //             <>
  //               {textNode}
  //               <BotCard>
  //                 <BotMessage
  //                   content={`Error executing SSH command: ${
  //                     (error as Error).message
  //                   }`}
  //                   showAvatar={false}
  //                 />
  //               </BotCard>
  //             </>
  //           );
  //         }
  //       },
  //     },
  //   },
  // });

  return {
    id: nanoid(),
    display: "hello",
  };
}

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState?.messages
    ?.map((message) => {
      if (message.role === "tool" && typeof message.content === "string") {
        try {
          const parsedContent = JSON.parse(message.content);
          return { ...message, content: parsedContent };
        } catch (error) {
          return message;
        }
      }
      return message;
    })
    ?.filter((message) => message.role !== "system")
    ?.map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "tool" ? (
          message.content.map((tool: any) => {
            return tool.toolName === AI_TOOL_EXECUTE_SQL_COMMAND ? (
              <BotCard>
                {(() => {
                  try {
                    const result = tool?.result;
                    return (
                      <CodeBlock
                        language="json"
                        value={JSON.stringify(result, null, 2)}
                      />
                    );
                  } catch (error) {
                    return (
                      <div className="text-red-500">
                        <p>Error parsing JSON result:</p>
                        <p>{JSON.stringify(tool?.result)}</p>
                      </div>
                    );
                  }
                })()}
              </BotCard>
            ) : null;
          })
        ) : message.role === "user" ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === "assistant" &&
          typeof message.content === "string" ? (
          <BotMessage content={message.content} />
        ) : null,
    }));
};

export const ExportChatAI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), siteId: "", messages: [] },
  onGetUIState: async () => {
    "use server";

    const user = { id: "55555" };

    if (user?.id) {
      const aiState = getAIState() as Chat;

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    "use server";

    // const user = await currentUser();
    const user = { id: "55555" };
    if (user?.id) {
      const { chatId, siteId, messages } = state;

      const createdAt = new Date();
      const userId = user.id as string;
      const path = `/sites/${siteId}/chat/${chatId}`;

      const firstMessageContent = messages[0].text?.[0]?.text as string;
      const title = firstMessageContent.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        siteId,
        createdAt,
        messages,
        path,
      };
      await saveChat(chat);
    } else {
      return;
    }
  },
});

export async function saveChat(chat: Chat) {
  const user = await currentUser();
  if (user) {
    await prisma.chat.upsert({
      where: { id: chat.id },
      update: {
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId,
        path: chat.path,
      },
      create: {
        id: chat.id,
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId || "",
        path: chat.path,
      },
    });

    // Get existing messages for this chat
    const existingMessages = await prisma.message.findMany({
      where: { chatId: chat.id },
      select: { id: true },
    });

    // Create new messages and update existing ones
    // const upsertPromises = chat.messages.map((message) =>
    //   prisma.message.upsert({
    //     where: { id: message.id },
    //     update: {
    //       content:
    //         typeof message.content === "string"
    //           ? message.content
    //           : message.content !== null
    //           ? JSON.stringify(message.content)
    //           : "",
    //       role: message.role,
    //       siteId: chat.siteId!,
    //     },
    //     create: {
    //       id: message.id as string,
    //       chatId: chat.id,
    //       content:
    //         typeof message.content === "string"
    //           ? message.content
    //           : message.content !== null
    //           ? JSON.stringify(message.content)
    //           : "",
    //       role: message.role,
    //       siteId: chat.siteId || "4z",
    //     },
    //   })
    // );

    await Promise.all(upsertPromises);

    // Delete messages that are no longer relevant
    const currentMessageIds = new Set(chat.messages.map((m) => m.id));
    const messagesToDelete = existingMessages.filter(
      (m) => !currentMessageIds.has(m.id)
    );

    if (messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          id: { in: messagesToDelete.map((m) => m.id) },
        },
      });
    }
  } else {
    return;
  }
}
