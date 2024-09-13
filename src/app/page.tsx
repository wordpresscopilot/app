import { Footer } from "@/components/footer";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";

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
  title: "PROMPT. DEVELOP. WORDPRESS.",
  description: "AI-Powered Wordpress Development",
  openGraph: {
    title: "GPT Wrapper for WordPress Development",
    description: "PROMPT. DEVELOP. WORDPRESS.",
    url: process.env.NEXT_PUBLIC_APP_URL!,
    images: "/wp.png",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-x-hidden">
        <div className="flex items-center w-full justify-center py-12 min-h-screen relative">
          <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center gap-2 items-center relative rounded md:max-w-full px-4 lg:px-0">
              <Image
                src="/wp_colored.png"
                alt="Wordpress Logo"
                width="140"
                height="140"
                className="rounded-full "
              />

              <div className="flex flex-col gap-4 text-center mb-4">
                <p className="mt-6 font-semibold text-5xl lg:text-6xl w-full tracking-wider">
                  AI Copilot for Wordpress Development
                </p>

                {/* */}
              </div>

              <Link href={`/sign-in`}>
                <Button
                  className="w-full min-w-[300px] z-10 relative"
                  //   style={
                  //     {
                  //       "--pulse-color": "#22D3EE",
                  //       "--duration": "1.5s",
                  //     } as React.CSSProperties
                  //   }
                >
                  <div className="relative z-10 uppercase">
                    Build Faster Now
                  </div>
                  <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
                  <BorderBeam size={60} duration={3} delay={0} />
                </Button>
              </Link>
              <WPMarquee />
              <div className="flex justify-center items-center gap-2">
                <span className="pointer-events-none whitespace-pre-wrap text-center font-semibold leading-none text-black dark:text-white">
                  <AnimatedGradientText className="text-2xl capitalize inline-flex items-center justify-center px-4 py-1 transition ease-out">
                    Prompt. Develop. Wordpress. Built to make you
                    extraordinarily productive, Cursor is the best way to code
                    with AI.
                  </AnimatedGradientText>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="hidden bg-muted lg:block group relative lg:w-1/2">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              Globe
            </span>
            <Globe className="top-28" />
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  );
}
