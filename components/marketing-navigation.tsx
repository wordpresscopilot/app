"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useState } from "react";
import { Button } from "./ui/button";

export const MarketingNavigation = ({
  scrollToWaitlistForm = () => {},
}: {
  scrollToWaitlistForm?: () => void;
}) => {
  const showAppEntryFlag = useFeatureFlagEnabled("show_app_entry");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    // {
    //   label: "About",
    //   href: "/about",
    // },
    {
      label: "Try Demo",
      href: "/demo",
    },
    {
      label: "Chat with Plugins",
      href: "/plugins",
    },
    ...(showAppEntryFlag
      ? [
          {
            label: "Account",
            href: "/account",
          },
        ]
      : []),
    ...(showAppEntryFlag
      ? [
          {
            label: "Onboarding",
            href: "/onboarding",
          },
        ]
      : []),
    {
      label: "WP Copilot Plugin Download",
      href: "/plugin",
    },
    ...(showAppEntryFlag
      ? [
          {
            label: "Sign In",
            href: "/sign-in",
          },
        ]
      : []),
    ...(showAppEntryFlag
      ? [
          {
            label: "Sign Up",
            href: "/sign-up",
          },
        ]
      : []),
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav>
      <div className="hidden lg:block">
        <div className="w-full flex justify-between items-stretch gap-2.5">
          {/* LOGO */}
          <div className="rounded-md bg-background h-fit flex navbar-logo px-1.5 py-[7px] pr-3 text-white bg-black dark:text-white dark:bg-gray-100">
            <Link
              href="/"
              className="flex items-center gap-1 text-white dark:text-black cursor-pointer"
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
          <div className="rounded-md bg-background py-2 px-2 flex-1 h-[50px] text-white bg-black dark:text-black dark:bg-gray-100">
            <div className="flex items-center gap-1.5">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center justify-center text-inherit text-base leading-[110%] gt-standard-mono px-3 py-2 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-gray-700 hover:text-black dark:hover:text-white cursor-pointer transition-colors duration-200"
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
            className="h-[50px] px-[18px] text-base gt-standard-mono cursor-pointer"
            onClick={scrollToWaitlistForm}
            asChild
          >
            <Link href="/sign-in">Login / Sign Up</Link>
          </Button>
        </div>
      </div>
      <div className="flex h-full w-full items-center lg:hidden">
        <div className="flex flex-col w-full">
          <div className="flex justify-between bg-black dark:bg-gray-800 items-center w-full rounded-md px-2 py-1.5">
            <div className="rounded-md bg-background h-fit flex navbar-logo px-1.5 py-[7px] pr-3 text-white bg-black dark:text-white dark:bg-gray-100">
              <Link
                href="/"
                className="flex items-center gap-1 text-white dark:text-black cursor-pointer"
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

            <button onClick={toggleMenu} className="text-white">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="text-white dark:text-gray-200 h-6 w-6 cursor-pointer"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z" />
              </svg>
            </button>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-black dark:bg-gray-800 mt-2 rounded-md overflow-hidden"
              >
                {links.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-white dark:text-gray-200 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="default"
                  size="lg"
                  className="m-4 text-base gt-standard-mono cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  asChild
                >
                  <Link href="/sign-in">Login / Sign Up</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* <section className="w-full bg-foreground text-background mt-3 py-4 px-6 rounded-md">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <p className="text-lg font-semibold mb-2 sm:mb-0">
              We are now in public alpha and allowing access.
            </p>
            <p className="text-sm mt-1">
              Please try on non-production sites only.
            </p>
          </div>
          <Link href="/sign-in">
            <Button>Try it now</Button>
          </Link>
        </div>
      </section> */}
    </nav>
  );
};
