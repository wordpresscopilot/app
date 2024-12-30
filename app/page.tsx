"use client";

import { Footer } from "@/components/footer";
import { MarketingNavigation } from "@/components/marketing-navigation";
import { PluginsMarquee } from "@/components/plugins-marquee";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconGitHub } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  const waitlistFormRef = React.useRef<HTMLFormElement>(null);

  const scrollToWaitlistForm = () => {
    if (waitlistFormRef.current) {
      const yOffset = -100;
      const element = waitlistFormRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => element.querySelector("input")?.focus(), 500);
    }
  };

  return (
    <div className="p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] mx-auto min-h-[100vh]">
      <main className="flex flex-col gap-2.5">
        <MarketingNavigation scrollToWaitlistForm={scrollToWaitlistForm} />

        <section className="w-full relative overflow-hidden rounded-md bg-black">
          <Image
            src="/landing/hero.webp"
            alt="hero"
            width={100}
            height={100}
            fetchPriority="high"
            decoding="async"
            className="object-cover"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              color: "transparent",
            }}
          />
          <div className="relative z-20 flex flex-col gap-4 md:gap-8 justify-between w-full h-full sm:w-[calc(100%-4rem)] mx-auto px-2.5 items-center py-[64px] md:py-[80px]">
            <h1 className="z-10 text-[32px] md:text-8xl text-white font-semibold text-center w-full">
              Open Source AI Agent
              <br />
              Copilot for Wordpress
            </h1>
            <p
              className="leading-[140%] text-xl md:text-4xl text-center text-white font-base sm:max-w-[70%] mx-auto"
              style={{ textWrap: "balance" }}
            >
              Open Source AI Agent + Plugin for Wordpress.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/demo">Try Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link
                  href="https://github.com/wordpresscopilot/app"
                  target="_blank"
                >
                  <IconGitHub />
                  View on GitHub
                </Link>
              </Button>
            </div>
            {/* <JoinWaitlistForm ref={waitlistFormRef} /> */}
          </div>
        </section>

        <Section
          color="#7dc7ff"
          label="Multi-Agent Wordpress Tools Supported"
          description="'Hey copilot, add the latest elementor plugin to my site.'"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
            <Card>
              <CardHeader>
                <CardTitle>Plugin Management</CardTitle>
                <CardDescription>
                  Search, install, and remove WordPress plugins.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Get core site data</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SQL Operations</CardTitle>
                <CardDescription>
                  Execute SQL queries and manage your WordPress database safely
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  View and analyze your WordPress site's current state
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Generation</CardTitle>
                <CardDescription>
                  Create custom pages and functionality through natural
                  conversation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>
                  Flush cache and optimize site performance with simple commands
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Monitoring</CardTitle>
                <CardDescription>
                  View and analyze your WordPress site's current state
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Section>
        <Section
          color="#f7cd72"
          label={`Updates at the\nspeed of AI.`}
          description="Modifying and interacting with your Wordpr
          ess site has never been easier."
        />
        <Section
          color="#f8bdf4"
          label={
            <>
              <span>Ask and receive informed answers</span>
            </>
          }
          description="Modifying and interacting with your Wordpress site has never been easier."
        />
        {/* <Section
          color="#F5F5F5"
          label="And so much more."
          className="md:pb-0 pb-0"
        >
          <div className="w-full max-w-[100%] relative">
            <WPMarquee />
          </div>
        </Section> */}
        <Section
          color="#F5F5F5"
          label={`What plugins\ndo we support?`}
          description="Idk, like, all of them."
          className="md:pb-0 pb-0"
        >
          <div className="w-full max-w-[100%] relative">
            <PluginsMarquee />
          </div>
        </Section>
        {/* <Section
          color="#ffffff"
          label="Frequently Asked Questions"
          className=""
        >
          <div className="max-w-[680px] w-full">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Who Should Use WPC.dev?</AccordionTrigger>
                <AccordionContent>
                  WPC.dev is perfect for any WordPress site owner who wants to
                  simplify their site management and enhance functionality
                  without the need for multiple plugins. It's especially useful
                  for those who want to implement custom features or follow
                  tutorials that require adding code to their site, as WPC.dev
                  provides a safe and easy way to do so.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What is required to use WPC.dev?
                </AccordionTrigger>
                <AccordionContent>
                  To use WPC.dev, you only need a WordPress site. Our platform
                  is designed to integrate seamlessly with WordPress, making it
                  accessible to all WordPress site owners.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Do I need Coding Skills to use WPC.dev?
                </AccordionTrigger>
                <AccordionContent>
                  Not at all! While WPC.dev can be used by those with coding
                  skills to extend their sites, our user-friendly interface
                  allows you to add and manage features without any coding
                  knowledge. We even offer an AI-powered assistant that can help
                  you implement custom functionalities by simply describing what
                  you need.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Will using WPC.dev slow down my website?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely not. WPC.dev is built with performance in mind,
                  ensuring that all features and functionalities are implemented
                  efficiently. Our platform is designed to optimize the way
                  custom code and features are loaded on your site, maintaining
                  fast performance while extending your site's capabilities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section> */}
        <div className="hidden xl:flex flex-col items-center justify-center w-full rounded-md py-10 px-5 gap-4 relative overflow-hidden">
          <Image
            alt="hero"
            src="/landing/hero.webp"
            width="2000"
            height="2000"
            className="absolute inset-0 object-cover z-[-1]"
            loading="lazy"
            style={{
              color: "transparent",
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const Section = ({
  color,
  label,
  description,
  image,
  imageWidth,
  imageHeight,
  className,
  children,
}: {
  color: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  children?: React.ReactNode;
}) => (
  <section
    className={cn(
      "w-full rounded-md pt-[32px] md:pt-[60px] flex flex-col items-center px-0 pb-[40px] md:pb-20 relative overflow-hidden h-full gap-1",
      className
    )}
    style={{ backgroundColor: color }}
  >
    <div className="flex flex-col gap-2 md:items-center md:text-center relative w-fit md:max-w-[100%] mx-auto text-black">
      {label && (
        <div className="">
          <h2 className="text-2xl md:text-6xl font-semibold text-text-primary flex items-center gap-2">
            {label}
          </h2>
        </div>
      )}
      {description && (
        <div
          className="text-base md:text-xl leading-[150%]"
          style={{
            textWrap: "pretty",
          }}
        >
          {description}
        </div>
      )}
      {image && (
        <Image
          src={image}
          alt="image"
          width={imageWidth}
          height={imageHeight}
          className="object-cover mt-4 rounded-md max-w-[85%]"
        />
      )}
      {children}
    </div>
    <NoiseBg />
  </section>
);

const NoiseBg = () => (
  <div
    className="absolute inset-0 z-0 w-full h-full scale-[3] transform opacity-[35%] [mask-image:radial-gradient(#fff,transparent,75%)] pointer-events-none select-none object-cover"
    style={{
      mixBlendMode: "overlay",
      backgroundImage: "url(/noise.png)",
      backgroundSize: "100%",
    }}
  />
);
