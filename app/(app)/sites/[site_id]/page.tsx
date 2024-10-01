import SiteHome from "@/components/site-home";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";

export default async function SitePage({
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
  const site = (await prisma.wp_site.findUnique({
    where: {
      id: site_id,
    },
  })) as WpSite;

  if (!site) {
    return <div>Site not found</div>;
  }
  return <SiteHome site={site} />;

  // <SetupProject site={site} />;

  // return (
  //   <AI initialAIState={{ chatId: id, siteId: id, messages: [] }}>
  //     <Chat id={id} user={mapClerkUserForClient(user!)} missingKeys={[]} />
  //   </AI>
  // );
}
