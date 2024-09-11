import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { AI, getSharedChat, getUIStateFromAIState } from "@/actions";
import { ChatList } from "@/components/chat-list";
import { FooterText } from "@/components/footer";
import { formatDate, mapClerkUserForClient } from "@/lib/utils";
import { UIState } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export const runtime = "edge";
export const preferredRegion = "home";

interface SharePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const chat = await getSharedChat(params.id);

  return {
    title: chat?.title.slice(0, 50) ?? "Chat",
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const user = await currentUser();
  const chat = await getSharedChat(params.id);

  if (!chat || !chat?.sharePath) {
    notFound();
  }

  const uiState: UIState = getUIStateFromAIState(chat);

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="border-b bg-background px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)} · {chat.messages.length} messages
              </div>
            </div>
          </div>
        </div>
        <AI>
          <ChatList
            messages={uiState}
            user={mapClerkUserForClient(user!)}
            isShared={true}
          />
        </AI>
      </div>
      <FooterText className="py-8" />
    </>
  );
}
