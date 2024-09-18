import { retrieveSites } from "@/actions/site";
import Onboarding from "@/components/onboarding";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Onboarding | Wordpress Copilot",
  description:
    "Set up your project with Wordpress Copilot - AI-Powered WordPress Development",
};

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const user_sites = await retrieveSites({
    user_id: user?.id,
  });

  if (user_sites?.length > 1 || user_sites?.[0]?.plugin_connected) {
    return redirect("/sites");
  }

  if (user_sites?.length === 1 && !user_sites?.[0]?.plugin_connected) {
    return <Onboarding user_site={user_sites?.[0]} />;
  }
  return <Onboarding />;
}
