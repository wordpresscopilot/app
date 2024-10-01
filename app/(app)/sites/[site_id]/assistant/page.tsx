import { AI } from "@/actions/assistantui";
import { AssistantUI } from "@/components/assistantui";
import { RSCRuntimeProvider } from "@/components/assistantui/rsc-runtime-provider";
import SiteHeader from "@/components/site-header";
import { getCoreSiteData } from "@/data/site";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";

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
  //   const user = {}; //await currentUser();
  const site = (await prisma.wp_site.findUnique({
    where: {
      id: site_id,
    },
  })) as WpSite;

  const coreSiteData = await getCoreSiteData(site);
  return (
    <AI>
      <RSCRuntimeProvider site={site} coreSiteData={coreSiteData}>
        <SiteHeader site={site} />
        <AssistantUI />
        {/* <ArtifactsView /> */}
      </RSCRuntimeProvider>
    </AI>
  );
}
