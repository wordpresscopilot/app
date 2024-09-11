import { redirect } from "next/navigation";

import { AI, getMissingKeys } from "@/actions";
import { ChatPageProps } from "@/app/(app)/chat/[id]/page";
import { Chat } from "@/components/chat";
import { mapClerkUserForClient, nanoid } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export interface SiteChatPageProps {
  params: {
    id: string;
  };
  searchParams: {
    site_id: string;
  };
}

// export async function generateMetadata({
//   params,
// }: SiteChatPageProps): Promise<Metadata> {
//   const user = await currentUser();

//   if (!user) {
//     return {};
//   }

//   const chat = await getChat(params.id, user.id);

//   if (!chat || "error" in chat) {
//     redirect("/");
//   } else {
//     return {
//       title: chat?.title.toString().slice(0, 50) ?? "Chat",
//     };
//   }
// }

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const user = await currentUser();
  const missingKeys = await getMissingKeys();

  if (!user) {
    redirect(`/sign-in?next=/chat/${params.id}`);
  }

  // const userId = user.id as string;
  // const chat = await getChat(params.id, userId);

  // if (!chat || "error" in chat) {
  //   redirect("/");
  // } else {
  // if (chat?.userId !== user?.id) {
  //   notFound();
  // }

  const new_chat_id = nanoid();
  return (
    <AI
      initialAIState={{
        chatId: new_chat_id,
        siteId: searchParams?.site_id!,
        messages: [],
      }}
    >
      <Chat
        id={new_chat_id}
        site_id={searchParams.site_id}
        user={mapClerkUserForClient(user)}
        missingKeys={missingKeys}
      />
    </AI>
  );
}
