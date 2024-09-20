"use server";

import prisma from "@/lib/prisma";
import { runSimplePiplineAggregation } from "@/lib/utils";
import { Chat } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    const prismaChat = chatWithMessages[0] as Chat;

    if (!prismaChat || (userId && prismaChat?.userId !== userId)) {
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

    const prismaChat = chatWithMessages[0] as Chat;

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
    const prismaChat = (await prisma.chat.findUnique({
      where: { id: id },
    })) as Chat;

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
