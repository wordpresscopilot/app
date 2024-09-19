import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AI, getChat } from "@/actions";
import { Chat } from "@/components/chat";
import { getMissingKeys, mapClerkUserForClient, nanoid } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export interface ChatPageProps {
  params: {
    chat_id: string;
  };
  searchParams: {
    site_id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const user = await currentUser();

  if (!user) {
    return {};
  }

  if (params.chat_id === "new") {
    return {
      title: "New Chat",
    };
  }

  const chat = await getChat(params.chat_id, user.id);

  if (!chat || "error" in chat) {
    redirect("/");
  } else {
    return {
      title: chat?.title.toString().slice(0, 50) ?? "Chat",
    };
  }
}
export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const user = await currentUser();
  const missingKeys = await getMissingKeys();

  if (!user) {
    redirect(`/sign-in?next=/chat/${params.chat_id}`);
  }

  let chatId: string;
  let siteId: string;
  let messages: any[] = [];

  if (params.chat_id === "new") {
    chatId = nanoid();
    siteId = searchParams.site_id;
  } else {
    const userId = user.id as string;
    const chat = await getChat(params.chat_id, userId);

    if (!chat || "error" in chat) {
      redirect(`/sites/${searchParams?.site_id}/chat/new`);
    }

    if (chat?.userId !== user?.id) {
      notFound();
    }

    chatId = chat.id;
    siteId = chat.siteId || searchParams.site_id;
    messages = chat.messages || [];
  }

  return (
    <AI
      initialAIState={{
        chatId,
        siteId,
        messages,
      }}
    >
      <Chat
        id={chatId}
        site_id={siteId}
        user={mapClerkUserForClient(user)}
        initialMessages={messages}
        missingKeys={missingKeys || []}
      />
    </AI>
  );
}
