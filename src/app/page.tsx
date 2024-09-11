import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import Globe from "@/components/magicui/globe";

import { Button } from "@/components/ui/button";
import { WPMarquee } from "@/components/wp-marquee";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// import { ShinyButton } from "@/components/magicui/shiny-button";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL === "http://localhost:3000"
      ? "http://127.0.0.1:3000"
      : process.env.NEXT_PUBLIC_APP_URL!
  ),
  title: "PROMPT. WORDPRESS. DEVELOP.",
  description: "AI-Powered Wordpress Development",
  openGraph: {
    title: "PROMPT. WORDPRESS. DEVELOP.",
    description: "AI-Powered Wordpress Development",
    url: process.env.NEXT_PUBLIC_APP_URL!,
    images: "/wp.png",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-x-hidden">
      <div className="flex items-center w-full justify-center py-12 min-h-screen relative">
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center gap-2 items-center relative rounded md:max-w-full px-4 lg:px-0">
            <Image
              src="/wp.png"
              alt="Wordpress Logo"
              width="180"
              height="180"
              className="rounded-full -mb-5"
            />

            <div className="flex flex-col gap-4 text-center mb-4">
              <div className="flex justify-center items-center gap-2">
                <span className="pointer-events-none whitespace-pre-wrap text-center font-semibold leading-none text-black dark:text-white">
                  <AnimatedGradientText className="text-xl inline-flex items-center justify-center px-4 py-1 transition ease-out">
                    GPT Wrapper for WordPress
                  </AnimatedGradientText>
                </span>
              </div>
              <p className="font-semibold text-xl w-full tracking-wider">
                PROMPT. WORDPRESS. DEVELOP.
              </p>
              <BorderBeam size={500} duration={5} delay={0} />
            </div>

            <Link href={`/sign-in`}>
              <Button
                className="w-full min-w-[300px] z-10 relative"
                style={
                  {
                    "--pulse-color": "#22D3EE",
                    "--duration": "1.5s",
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10">GO</div>
                <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
              </Button>
            </Link>
            <WPMarquee />
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block group relative lg:w-1/2">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Globe
          </span>
          <Globe className="top-28" />
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        </div>
      </div>
    </div>
  );
}
