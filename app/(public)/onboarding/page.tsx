import { Onboarding } from "@/components/onboarding";
import { retrieveSites } from "@/data/site";
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

  // Retrieve the user's sites
  const user_sites = await retrieveSites({
    user_id: user?.id,
  });

  // // If the user has more than one site or the plugin is connected, redirect to the sites page
  // if (user_sites?.length > 1 || user_sites?.[0]?.plugin_connected) {
  //   return redirect("/sites");
  // }

  // // If the user has only one site and the plugin is not connected, show the onboarding page for that site
  // if (user_sites?.length === 1 && !user_sites?.[0]?.plugin_connected) {
  //   return <Onboarding user_site={user_sites?.[0]} />;
  // }

  // If the user has no sites, show the general onboarding page
  return <Onboarding />;
}
