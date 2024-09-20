"use client";

import Marquee from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Easy Plugin Setup",
    description:
      "Easily install and configure WordPress plugins with guided assistance.",
    icon: "🔌",
  },
  {
    title: "Run SQL Queries",
    description: "Execute SQL queries directly on your WordPress database.",
    icon: "🗃️",
  },
  {
    title: "SSH Integration",
    description:
      "Search, understand, and generate WordPress theme code with a simple prompt.",
    icon: "📂",
  },
  {
    title: "AI Content Generation",
    description: "Create high-quality content with AI-powered assistance.",
    icon: "🤖",
  },
  {
    title: "Export / Import",
    description: "Seamlessly transfer your WordPress data between sites.",
    icon: "↔️",
  },
  {
    title: "Custom Shortcodes",
    description:
      "Create and manage custom shortcodes for enhanced functionality.",
    icon: "🏷️",
  },
];

const firstRow = features.slice(0, features.length / 2);
const secondRow = features.slice(features.length / 2);

export function WPMarquee() {
  return (
    <div className="relative flex h-[400px] w-full max-w-[100vw] lg:max-w-[100%] flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover={true} className="[--duration:20s]">
        {firstRow.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={true} className="[--duration:20s]">
        {secondRow.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </Marquee>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <figcaption className="text-base font-medium">{title}</figcaption>
      </div>
      <p className="mt-2 text-sm">{description}</p>
    </figure>
  );
};
