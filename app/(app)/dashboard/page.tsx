import { DashboardContent } from "@/components/dashboard";
import { retrieveSites } from "@/data/site";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const user_sites = await retrieveSites({
    user_id: user.id,
  });

  if (user_sites.length === 0) {
    redirect("/onboarding");
  }

  return <DashboardContent user_sites={user_sites} />;
}
