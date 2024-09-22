import { type Metadata } from "next";

import { getSharedChat } from "@/actions";
import { AccountSettings } from "@/components/account-settings";
import { mapClerkUserForClient } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

export default async function AccountSettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <AccountSettings user={mapClerkUserForClient(user!)} />;
}
