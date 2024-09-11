import { retrieveSites } from "@/actions/site";
import SitesDashboard from "@/components/sites-dashboard";
import { currentUser } from "@clerk/nextjs/server";
export default async function Page() {
  const user = await currentUser();
  const user_sites = await retrieveSites({
    user_id: user?.id!,
  });

  return <SitesDashboard wp_sites={user_sites} />;
}
