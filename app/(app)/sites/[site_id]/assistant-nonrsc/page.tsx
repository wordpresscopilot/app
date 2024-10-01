import { AssistantUI } from "@/components/assistantui";
import { CustomExternalStoreRuntimeProvider } from "@/components/assistantui/external-store-runtime-provider";
import SiteHeader from "@/components/site-header";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

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
    },
  })) as WpSite;

  return (
    <CustomExternalStoreRuntimeProvider site={site}>
      <SiteHeader site={site} />
      <AssistantUI />
    </CustomExternalStoreRuntimeProvider>
  );
}
