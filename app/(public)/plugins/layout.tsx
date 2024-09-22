"use client";

import { JoinWaitlistForm } from "@/components/JoinWaitlistForm";
import { MarketingNavigation } from "@/components/marketing-navigation";
import Image from "next/image";
import { useRef } from "react";
interface PluginLayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: PluginLayoutProps) {
  const waitlistFormRef = useRef<HTMLDivElement>(null);
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
    <div className="w-full p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] mx-auto min-h-[100vh]">
      <div className="flex flex-col gap-2.5">
        <MarketingNavigation scrollToWaitlistForm={scrollToWaitlistForm} />
        {children}
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
      </div>
      {/* <Footer /> */}
    </div>
  );
}
