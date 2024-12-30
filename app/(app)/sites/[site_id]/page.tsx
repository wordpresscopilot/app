import SiteHome from "@/components/site-home";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  const user = await currentUser();
  const site = (await prisma.wp_site.findUnique({
    where: {
      user_id: user?.id,
      id: site_id,
    },
  })) as WpSite;

  if (!site) {
    return redirect("/sites");
  }
  return <SiteHome site={site} />;
}
