import SiteConnectCard from "@/components/site-connect-card";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface ConnectPageProps {
  searchParams: {
    wpurl: string;
    api_key: string;
  };
}

export default async function ConnectPage({
  searchParams: { wpurl, api_key },
}: ConnectPageProps) {
  const user = await currentUser();
  if (!user) {
    const redirect_url = `/connect?wp_url=${wpurl}&api_key=${api_key}`;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(redirect_url)}`);
  }

  return <SiteConnectCard />;
}
