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
import { nanoid, runSimplePiplineAggregation, sleep } from "@/lib/utils";
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
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { WP_SAGE_RUN_SQL } from "@/lib/paths";
import { z } from "zod";
import { executeWordPressSQL } from "./wp";

export async function getChats(userId?: string | null, siteId?: string | null) {
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
      where: {
        userId,
        ...(siteId ? { siteId } : {}),
      },
      orderBy: { createdAt: "desc" },
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

    // If KV cache fails or chat not found, use MongoDB aggregation
    const chatWithMessages = await runSimplePiplineAggregation({
      pipeline: [
        { $match: { _id: id } },
        {
          $lookup: {
            from: "message",
            localField: "_id",
            foreignField: "chatId",
            as: "messages",
          },
        },
        {
          $addFields: {
            id: "$_id",
          },
        },
      ],
      collectionName: "chat",
    });

    const prismaChat = chatWithMessages[0];

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
    // If KV cache fails or chat not found, use MongoDB aggregation
    const chatWithMessages = await runSimplePiplineAggregation({
      pipeline: [
        { $match: { _id: id } },
        {
          $lookup: {
            from: "message",
            localField: "_id",
            foreignField: "chatId",
            as: "messages",
          },
        },
        {
          $addFields: {
            id: "$_id",
          },
        },
      ],
      collectionName: "chat",
    });

    const prismaChat = chatWithMessages[0];

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

          const result = await executeWordPressSQL({
            query,
            api_key: site?.api_key,
            api_url: `${site?.base_url}${WP_SAGE_RUN_SQL}`,
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
            ? parsedResult
            : // `SQL query executed successfully. Result: ${JSON.stringify(
              //     parsedResult,
              //     null,
              //     2
              //   )}`
              `Error executing SQL query. The result is not valid JSON: ${parsedResult}`;

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
            return tool.toolName === "executeSQL" ? (
              <BotCard>
                {(() => {
                  try {
                    const result = tool?.result;
                    // if (!result || typeof result !== "string") {
                    //   return (
                    //     <div className="text-red-500">
                    //       <p>Error parsing JSON result:</p>
                    //       <p>{JSON.stringify(tool?.result)}</p>
                    //     </div>
                    //   );
                    // }s
                    // const parsedResult = JSON.parse(result);
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
          siteId: chat.siteId,
        },
        create: {
          id: message.id,
          chatId: chat.id,
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
          role: message.role,
          siteId: chat.siteId,
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
