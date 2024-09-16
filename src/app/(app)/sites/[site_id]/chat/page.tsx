import { redirect } from "next/navigation";

export interface SiteChatPageProps {
  params: {
    id: string;
  };
  searchParams: {
    site_id: string;
  };
}

export default async function ChatPage({
  params,
  searchParams,
}: SiteChatPageProps) {
  return redirect(`/sites/${searchParams?.site_id}/chat/new`);
}
