"use server";

import { CodeExecutionSkeleton } from "@/components/skeletons/code-execution-skeleton";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from "@/components/stocks/message";
import { CodeBlock } from "@/components/ui/codeblock";
import prisma from "@/lib/prisma";
import { nanoid, sleep } from "@/lib/utils";
import { AIState, Chat, UIState, WpSite } from "@/types";
import { openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import {
  createAI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { redirect } from "next/navigation";

import { AI_TOOL_EXECUTE_SQL } from "@/lib/constants";
import { WP_PATH_RUN_SQL } from "@/lib/paths";
import { z } from "zod";
import { executeWordPressSQL } from "./wp";

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), siteId: "", messages: [] },
  onGetUIState: async () => {
    "use server";

    const user = await currentUser();

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

    const user = await currentUser();
    if (user) {
      const { chatId, siteId, messages } = state;

      const createdAt = new Date();
      const userId = user.id as string;
      const path = `/sites/${siteId}/chat/${chatId}`;

      const firstMessageContent = messages[0].content as string;
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

async function submitUserMessage(content: string, site: WpSite) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    initial: <SpinnerMessage />,
    system: `\
    You are an AI assistant for WordPress site management and development, you have access to run WordPress SQL queries and sftp access to the site. You help users with various tasks related to their WordPress site.

    You have the ability to execute SQL queries on the WordPress database to assist users. Your capabilities include:

    When a user requests a task or asks about a solution, analyze it carefully and ask clarifying questions to understand what must be done and offer a solution when you have one that works. Confirm the solution with the user.
    
    Always prioritize security and best practices when interacting with the database.

    If a task requires multiple SQL queries or steps, break it down and explain each step to the user.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }
      return textNode;
    },
    tools: {
      [AI_TOOL_EXECUTE_SQL]: {
        description: "Execute SQL query on the WordPress database.",
        parameters: z.object({
          query: z.string().describe("The SQL query to execute"),
        }),
        generate: async function* ({ query }) {
          yield (
            <>
              {textNode}
              <BotCard>
                <BotMessage
                  content={`Executing SQL query: ${query}`}
                  showAvatar={false}
                />
                <CodeExecutionSkeleton />
              </BotCard>
            </>
          );

          await sleep(1000);

          // if (!site?.connected) {
          //   return (
          //     <>
          //       {textNode}
          //       <BotCard>
          //         <BotMessage
          //           content={`Error executing SQL query: WordPress site not connected.`}
          //           showAvatar={false}
          //         />
          //         <Link href={`/sites/${site?.id}`} className="mt-4">
          //           <Button>Fix in Site Settings</Button>
          //         </Link>
          //       </BotCard>
          //     </>
          //   );
          // }

          const { status, ok, data } = await executeWordPressSQL({
            query,
            api_key: site?.api_key,
            api_url: `${site?.base_url}${WP_PATH_RUN_SQL}`,
          });
          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,

              // {
              //   id: nanoid(),
              //   role: "assistant",
              //   content: [
              //     {
              //       type: "tool-call",
              //       toolName: "executeSQL",
              //       toolCallId,
              //       args: { query },
              //     },
              //   ],
              // },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: AI_TOOL_EXECUTE_SQL,
                    toolCallId,
                    result: data,
                  },
                ],
              },
            ],
          });

          return (
            <>
              {textNode}
              <BotCard>
                <BotMessage
                  content={`Executing SQL query: ${query}`}
                  showAvatar={false}
                />
                <div className={"group relative flex items-start"}>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {(() => {
                      try {
                        return (
                          <CodeBlock
                            language="json"
                            value={JSON.stringify(data, null, 2)}
                          />
                        );
                      } catch (error) {
                        return (
                          <div className="text-red-500">
                            <p>Error parsing JSON result:</p>
                            <p>{(error as Error).message}</p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </BotCard>
            </>
          );
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: result.value,
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
            return tool.toolName === AI_TOOL_EXECUTE_SQL ? (
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

export async function saveChat(chat: Chat) {
  const user = await currentUser();
  if (user) {
    // Save to KV cache
    const pipeline = kv.pipeline();
    pipeline.hmset(`chat:${chat.id}`, chat);
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`,
    });
    await pipeline.exec();
    // Save or update in Prisma database
    // Upsert the chat
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
        siteId: chat.siteId!,
        path: chat.path,
      },
    });

    // Get existing messages for this chat
    const existingMessages = await prisma.message.findMany({
      where: { chatId: chat.id },
      select: { id: true },
    });

    // Create new messages and update existing ones
    const upsertPromises = chat.messages.map((message) =>
      prisma.message.upsert({
        where: { id: message.id },
        update: {
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
          role: message.role,
          siteId: chat.siteId!,
        },
        create: {
          id: message.id,
          chatId: chat.id,
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
          role: message.role,
          siteId: chat.siteId || "",
        },
      })
    );

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

export async function refreshHistory(path: string) {
  redirect(path);
}
