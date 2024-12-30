import SitesDashboard from "@/components/sites-dashboard";
import { retrieveSites } from "@/data/site";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  const user_sites = await retrieveSites({
    user_id: userId!,
  });

  return <SitesDashboard wp_sites={user_sites} />;
}
