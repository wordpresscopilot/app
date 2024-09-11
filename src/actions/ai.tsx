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
import { AIState, Chat, UIState } from "@/types";
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
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { executeWordPressSQL } from "./wp";

export async function getChats(userId?: string | null) {
  const user = await currentUser();

  if (!userId) {
    return [];
  }

  if (userId !== user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Try to fetch from KV cache first
    const pipeline = kv.pipeline();
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true,
    });

    for (const chat of chats) {
      pipeline.hgetall(chat);
    }

    const results = await pipeline.exec();

    if (results.length > 0) {
      return results as Chat[];
    }

    // If KV cache fails or is empty, use Prisma
    const prismaChats = await prisma.chat.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      include: { messages: true },
    });

    return prismaChats as Chat[];
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  const user = await currentUser();

  if (userId !== user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Try to fetch from KV cache first
    const chat = await kv.hgetall<Chat>(`chat:${id}`);

    if (chat && (!userId || chat.userId === userId)) {
      return chat;
    }

    // If KV cache fails or chat not found, use Prisma
    const prismaChat = await prisma.chat.findUnique({
      where: { id: id },
      include: { messages: true },
    });

    if (!prismaChat || (userId && prismaChat.userId !== userId)) {
      return null;
    }

    return prismaChat as Chat;
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Try to remove from KV cache first
    const uid = String(await kv.hget(`chat:${id}`, "userId"));

    if (uid === user.id) {
      await kv.del(`chat:${id}`);
      await kv.zrem(`user:chat:${user.id}`, `chat:${id}`);
    }

    // Remove from Prisma database
    await prisma.chat.delete({
      where: { id: id, userId: user.id },
    });

    revalidatePath("/");
    return revalidatePath(path);
  } catch (error) {
    console.error("Error removing chat:", error);
    return { error: "Failed to remove chat" };
  }
}

export async function clearChats() {
  const user = await currentUser();

  if (!user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Clear from KV cache
    const chats: string[] = await kv.zrange(`user:chat:${user.id}`, 0, -1);
    if (chats.length > 0) {
      const pipeline = kv.pipeline();
      for (const chat of chats) {
        pipeline.del(chat);
        pipeline.zrem(`user:chat:${user.id}`, chat);
      }
      await pipeline.exec();
    }

    // Clear from Prisma database
    await prisma.chat.deleteMany({
      where: { userId: user.id },
    });

    revalidatePath("/");
    return redirect("/");
  } catch (error) {
    console.error("Error clearing chats:", error);
    return { error: "Failed to clear chats" };
  }
}

export async function getSharedChat(id: string) {
  try {
    // Try to fetch from KV cache first
    const chat = await kv.hgetall<Chat>(`chat:${id}`);

    if (chat && chat.sharePath) {
      return chat;
    }

    // If KV cache fails or chat not found, use Prisma
    const prismaChat = await prisma.chat.findUnique({
      where: { id: id },
      include: { messages: true },
    });

    if (!prismaChat || !prismaChat.sharePath) {
      return null;
    }

    return prismaChat as Chat;
  } catch (error) {
    console.error("Error fetching shared chat:", error);
    return null;
  }
}

export async function shareChat(id: string) {
  const user = await currentUser();

  if (!user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // Try to update KV cache first
    const chat = await kv.hgetall<Chat>(`chat:${id}`);

    if (chat && chat.userId === user.id) {
      const payload = {
        ...chat,
        sharePath: `/share/${chat.id}`,
      };
      await kv.hmset(`chat:${chat.id}`, payload);
      return payload;
    }

    // If KV cache fails or chat not found, use Prisma
    const prismaChat = await prisma.chat.findUnique({
      where: { id: id },
    });

    if (!prismaChat || prismaChat.userId !== user.id) {
      return {
        error: "Something went wrong",
      };
    }

    const updatedChat = await prisma.chat.update({
      where: { id: id },
      data: { sharePath: `/share/${id}` },
    });

    return updatedChat as Chat;
  } catch (error) {
    console.error("Error sharing chat:", error);
    return { error: "Failed to share chat" };
  }
}

export async function refreshHistory(path: string) {
  redirect(path);
}

export async function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"];
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "");
}

async function submitUserMessage(content: string) {
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
      executeSQL: {
        description: "Execute SQL query on the WordPress database.",
        parameters: z.object({
          query: z.string().describe("The SQL query to execute"),
        }),
        generate: async function* ({ query }) {
          // Ensure the AI text stream is always visible
          yield (
            <>
              {textNode}
              <BotCard>
                <CodeExecutionSkeleton />
              </BotCard>
            </>
          );

          await sleep(1000);

          const result = await executeWordPressSQL({
            query,
            api_key: "wpsage_test_key_123",
            api_url:
              "https://wpsage-1cd140.ingress-haven.ewp.live/wp-json/wpsage/v1/run-sql",
          });
          let parsedResult;
          let isValidJSON = true;
          try {
            parsedResult = JSON.parse(result);
          } catch (error) {
            isValidJSON = false;
            parsedResult = result;
          }

          const resultContent = isValidJSON
            ? `SQL query executed successfully. Result: ${JSON.stringify(
                parsedResult,
                null,
                2
              )}`
            : `Error executing SQL query. The result is not valid JSON: ${parsedResult}`;

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

          await sleep(500);

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "executeSQL",
                    toolCallId,
                    args: { query },
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "executeSQL",
                    toolCallId,
                    result: resultContent,
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
                {/* <BotMessage content={result} showAvatar={false} /> */}
                <div className={"group relative flex items-start"}>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {(() => {
                      try {
                        const parsedResult = JSON.parse(result);
                        return (
                          <CodeBlock
                            language="json"
                            value={JSON.stringify(parsedResult, null, 2)}
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
    ?.filter((message) => message.role !== "system")
    ?.map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "tool" ? (
          message.content.map((tool) => {
            return tool.toolName === "executeSQL" ? (
              <BotCard>
                {(() => {
                  try {
                    const parsedResult = JSON.parse(tool?.result);
                    return (
                      <CodeBlock
                        language="json"
                        value={JSON.stringify(parsedResult, null, 2)}
                      />
                    );
                  } catch (error) {
                    return (
                      <div className="text-red-500">
                        <p>Error parsing JSON result:</p>
                        <p>{tool?.result}</p>
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

    console.log("saveChat", chat);
    // Save or update in Prisma database
    await prisma.chat.upsert({
      where: { id: chat.id },
      update: {
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId,
        path: chat.path,
        messages: {
          deleteMany: {},
          create: chat.messages.map((message) => ({
            content: message.content,
            role: message.role,
          })),
        },
      },
      create: {
        id: chat.id,
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId,
        path: chat.path,
        messages: {
          create: chat.messages.map((message) => ({
            content: message.content,
            role: message.role,
          })),
        },
      },
    });
  } else {
    return;
  }
}
