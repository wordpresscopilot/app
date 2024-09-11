import Onboarding from "@/components/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | w-p.ai",
  description:
    "Set up your project with w-p.ai - AI-Powered WordPress Development",
};

export default function OnboardingPage() {
  return <Onboarding />;
}
