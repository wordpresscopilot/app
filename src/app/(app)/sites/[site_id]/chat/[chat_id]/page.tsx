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

  if (params.chat_id === "new") {
    const new_chat_id = nanoid();
    return (
      <AI
        initialAIState={{
          chatId: new_chat_id,
          siteId: searchParams.site_id,
          messages: [],
        }}
      >
        <Chat
          id={new_chat_id}
          site_id={searchParams.site_id}
          user={mapClerkUserForClient(user)}
          initialMessages={[]}
          missingKeys={missingKeys || []}
        />
      </AI>
    );
  }

  const userId = user.id as string;
  const chat = await getChat(params.chat_id, userId);

  if (!chat || "error" in chat) {
    redirect(`/sites/${searchParams?.site_id}/chat/new`);
  } else {
    if (chat?.userId !== user?.id) {
      notFound();
    }

    return (
      <>
        <AI
          initialAIState={{
            chatId: chat?.id,
            siteId: chat?.siteId || searchParams.site_id,
            messages: chat?.messages || [],
          }}
        >
          <Chat
            id={chat?.id}
            site_id={chat?.siteId || searchParams.site_id}
            user={mapClerkUserForClient(user)}
            initialMessages={chat.messages || []}
            missingKeys={missingKeys || []}
          />
        </AI>
      </>
    );
  }
}
