import { AI } from "@/actions/ai";
import { Chat } from "@/components/chat";
import SetupProject from "@/components/setup-project";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export default async function SitePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const site = (await prisma.wp_site.findUnique({
    where: {
      id,
    },
  })) as WpSite;
  if (!site) {
    return <div>Site not found</div>;
  }
  if (!site.connected) {
    return <SetupProject site={site} />;
  }

  const user = await currentUser();
  // const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={{}} missingKeys={[]} />
    </AI>
  );
}
