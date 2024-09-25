import { ExportUI } from "@/components/pipelines";
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
  const site = (await prisma.wp_site.findUnique({
    where: {
      id: site_id,
    },
  })) as WpSite;

  const coreSiteData = await getCoreSiteData(site.id);
  console.log({
    coreSiteData,
  });
  return <ExportUI site={site} coreSiteData={coreSiteData} />;
}
