import SitesDashboard from "@/components/sites-dashboard";
import { retrieveSites } from "@/data/site";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();
  console.log({ user });
  const user_sites = await retrieveSites({
    user_id: user?.id!,
  });

  return <SitesDashboard wp_sites={user_sites} />;
}
