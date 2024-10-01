import { AI } from "@/actions/export-ai";
import { Chat } from "@/components/exportai/chat";
import { getCoreSiteData } from "@/data/site";
import prisma from "@/lib/prisma";
import { mapClerkUserForClient } from "@/lib/utils";
import { WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export default async function ExportPage({
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
    },
  })) as WpSite;

  const coreSiteData = await getCoreSiteData(site);

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat
        id={id}
        user={mapClerkUserForClient(user!)}
        site={site}
        coreSiteData={coreSiteData}
      />
    </AI>
  );
}
