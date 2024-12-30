import { AssistantUI } from "@/components/assistantui";
import {
  LocalRuntimeProvider,
  LocalRuntimeProvider,
} from "@/components/assistantui/local-runtime";
import SiteHeader from "@/components/site-header";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WPAssistantNonRSCPage({
  params: { id },
  searchParams: { site_id },
}: {
  params: {
    id: string;
  };
  searchParams: {
    site_id: string;
  };
}) {
  const user = await currentUser();
  const site = (await prisma.wp_site.findUnique({
    where: {
      id: site_id,
      user_id: user?.id,
    },
  })) as WpSite;
  if (!site) redirect("/sites");
  return (
    <LocalRuntimeProvider site={site}>
      <SiteHeader site={site} />
      <AssistantUI />
    </LocalRuntimeProvider>
  );
}
