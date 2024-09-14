"use client";
import { Footer } from "@/components/footer";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import FlickeringGrid from "@/components/magicui/flickering-grid";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { ShinyButton } from "@/components/magicui/shiny-button";

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL === "http://localhost:3000"
//       ? "http://127.0.0.1:3000"
//       : process.env.NEXT_PUBLIC_APP_URL!
//   ),
//   title: "Wordpress Copilot",
//   description: "AI-Powered Wordpress Development",
//   openGraph: {
//     title: "Wordpress Copilot",
//     description: "AI-Powered Wordpress Development",
//     url: process.env.NEXT_PUBLIC_APP_URL!,
//     images: "/wp.png",
//     locale: "en_US",
//     type: "website",
//   },
// };

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <FlickeringGrid
        className="absolute inset-0"
        squareSize={4}
        gridGap={6}
        color="#1E3A8A"
        maxOpacity={0.3}
        flickerChance={0.05}
        width={dimensions.width}
        height={dimensions.height}
      />
      <div className="mt-0 sm:mt-8 flex flex-col justify-center items-center w-full max-w-screen-xl overflow-x-hidden">
        <div className="flex relative overflow-hidden bg-gray-200 rounded-xl p-8 items-center w-full justify-center relative">
          <div className="flex justify-center items-center">
            <div className="mt-14 flex flex-col justify-center gap-2 items-center relative rounded md:max-w-full px-4 lg:px-0">
              {/* <Image
                src="/wp_colored.png"
                alt="Wordpress Logo"
                width="140"
                height="140"
                className="rounded-full "
              /> */}

              <div className="flex flex-col gap-6 text-center p-4 tracking-wider">
                <p className="font-semibold text-5xl w-full">
                  AI Copilot for Wordpress Development
                </p>
                <AnimatedGradientText className="font-medium text-2xl inline-flex items-center justify-center px-4 py-1 transition ease-out">
                  Built to make you extraordinarily productive at Wordpress.
                </AnimatedGradientText>
              </div>

              <Link href={`/sign-in`}>
                <Button className="w-full text-xl tracking-wider font-medium min-w-[300px] z-10 relative">
                  <div className="relative z-10">
                    Build Faster Now - For Free
                  </div>
                  <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
                  <BorderBeam size={60} duration={3} delay={0} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col relative gap-4 w-full">
          <Card className="bg-pink-200 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="space-y-2 text-center mb-6 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Knows your codebase
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Get the best answers from your codebase - or refer to specific
                  files or docs. Use the model&#39;s code in one click.
                </p>
              </div>
              <div className="w-full aspect-[16/9] bg-pink-100 rounded-lg shadow-lg" />
            </CardContent>
          </Card>

          <Card className="bg-blue-200 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center">
              <div className="space-y-2 text-center mb-6 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Just hit tab
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                  Cursor lets you breeze through changes by predicting your next
                  edit.
                </p>
              </div>
              <div className="w-full aspect-[16/9] bg-blue-100 rounded-lg shadow-lg" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}
