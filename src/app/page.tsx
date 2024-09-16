"use client";

import { Footer } from "@/components/footer";
import { JoinWaitlistForm } from "@/components/JoinWaitlistForm";
import { Button } from "@/components/ui/button";
import { WPMarquee } from "@/components/wp-marquee";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const waitlistFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
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

  const scrollToWaitlistForm = () => {
    if (waitlistFormRef.current) {
      const yOffset = -100; // Adjust this value to increase or decrease the top padding
      const element = waitlistFormRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => element.querySelector("input")?.focus(), 500); // Focus on the input after scrolling
    }
  };

  return (
    <div className="p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] mx-auto min-h-[100vh]">
      <main className="flex flex-col gap-2.5">
        <Navigation scrollToWaitlistForm={scrollToWaitlistForm} />
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
            <h1 className="z-10 text-[40px] md:text-8xl text-white font-semibold text-center w-full">
              AI Powered Wordpress Copilot
            </h1>
            <p
              className="leading-[140%] text-xl md:text-4xl text-center text-white font-base sm:max-w-[70%] mx-auto"
              style={{ textWrap: "balance" }}
            >
              Wordpress Copilot is the fastest way to build and interact with
              your Wordpress site.
            </p>
            <JoinWaitlistForm ref={waitlistFormRef} />
          </div>
        </section>
        <Section
          color="#f8bdf4"
          label={
            <>
              <span>Prompt</span>
              <ArrowRight size={56} strokeWidth={2.5} className="mt-1.5" />
              <span>Result</span>
            </>
          }
          description="Modifying and interacting with your Wordpress site has never been easier."
          image="https://placehold.co/1920x1080.png"
          imageWidth={1920}
          imageHeight={1080}
        />
        <Section
          color="#7dc7ff"
          label="Need some data? Just ask."
          description={`"Hey copilot, show me our top 10 products by revenue."`}
          image="https://placehold.co/1920x1080.png"
          imageWidth={1920}
          imageHeight={1080}
        />
        <Section
          color="#f7cd72"
          label="Updates at the speed of AI."
          description="Write a new about page, add a tax-line to your checkout, and so much more."
          image="https://placehold.co/1920x1080.png"
          imageWidth={1920}
          imageHeight={1080}
        />
        {/* Marquee */}
        <Section
          color="#F5F5F5"
          label="And so much more."
          className="md:pb-0 pb-0"
        >
          <div className="w-full max-w-[100%] relative">
            <WPMarquee />
          </div>
        </Section>
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
          <div className="z-100 flex flex-col items-center justify-center gap-8 text-white">
            <h1 className="text-5xl">Join the Waitlist Now</h1>
            <JoinWaitlistForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const Navigation = ({
  scrollToWaitlistForm,
}: {
  scrollToWaitlistForm: () => void;
}) => {
  const links = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Account",
      href: "/account",
    },
    {
      label: "Onboarding",
      href: "/onboarding",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Share",
      href: "/share",
    },
    {
      label: "Sign In",
      href: "/sign-in",
    },
    {
      label: "Sign Up",
      href: "/sign-up",
    },
  ];

  return (
    <nav>
      <div className="hidden lg:block">
        <div className="w-full flex justify-between items-stretch gap-2.5">
          {/* LOGO */}
          <div className="rounded-md bg-background h-fit flex navbar-logo px-1.5 py-[7px] pr-3 dark:bg-gray-100">
            <Link
              href="/"
              className="flex items-center gap-1 text-white dark:text-black"
            >
              <div className="w-9 h-9 inline-block relative">
                <Image
                  alt="logo"
                  src="/logo/logo-color.svg"
                  width={36}
                  height={36}
                />
              </div>
              <div className="relative">WP Copilot</div>
            </Link>
          </div>
          {/* NAV LINKS */}
          <div className="rounded-md bg-background py-2 px-2 flex-1 h-[50px] text-white dark:bg-gray-100 dark:text-black">
            <div className="flex items-center gap-1.5">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center justify-center text-text-on-fill text-base leading-[110%] gt-standard-mono px-3 py-2 rounded-md hover:bg-[#F5F5F5] hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {/* WAITLIST BUTTON */}
          <Button
            variant="default"
            size="lg"
            className="h-[50px] px-[18px] text-base gt-standard-mono"
            onClick={scrollToWaitlistForm}
          >
            Join the Waitlist
          </Button>
        </div>
      </div>
      <div className="flex h-full w-full items-center lg:hidden">
        <div className="flex justify-between bg-black items-center w-full rounded-md px-2 py-1.5">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              alt="logo"
              src="/assets/images/logo.png"
              width={24}
              height={24}
            />
            <Image
              alt="logo-words"
              src="/assets/images/logo-words.svg"
              width={80.336}
              height={13.32}
            />
          </Link>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="text-white h-6 w-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

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
    <div className="flex flex-col gap-2 md:items-center md:text-center relative w-fit max-w-[85%] md:max-w-[100%] mx-auto text-black">
      {label && (
        <div className="max-w-[680px]">
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
