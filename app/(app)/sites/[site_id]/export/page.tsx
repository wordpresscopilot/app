import ExportForm from "@/components/pipelines/export";
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

  const core_site_data = await getCoreSiteData(site.id);
  console.log({
    core_site_data,
  });
  return <ExportForm site={site} core_site_data={core_site_data} />;
}
