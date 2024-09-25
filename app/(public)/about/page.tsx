"use client";
import { BentoGridWordpress } from "@/components/bento-grid-wordpress";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { MarketingNavigation } from "@/components/marketing-navigation";
import { Check } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
const FeatureComparison = () => {
  const features = [
    "AI-Powered Insights",
    "Smart Layout Suggestions",
    "Automated Code Optimization",
    "Performance Analytics",
    "SEO Recommendations",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-4 text-left">Feature</th>
            <th className="p-4 text-center">Wordpress Sage</th>
            <th className="p-4 text-center">Traditional WordPress</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
            >
              <td className="p-4">{feature}</td>
              <td className="p-4 text-center">
                <Check className="inline-block text-primary" />
              </td>
              <td className="p-4 text-center">
                {index < 2 ? (
                  <Check className="inline-block text-gray-500" />
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function HomePage() {
  const waitlistFormRef = React.useRef<HTMLFormElement>(null);

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
  const [email, setEmail] = useState("");
  const [isHovering, setIsHovering] = useState(false);
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
    <div className="p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] mx-auto min-h-[100vh]">
      <main className="flex flex-col gap-2.5">
        <MarketingNavigation scrollToWaitlistForm={scrollToWaitlistForm} />

        <div className="flex flex-col bg-foreground overflow-hidden">
          <main className="relative z-10 flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 relative">
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
              <FlickeringGrid
                className="absolute inset-0"
                squareSize={4}
                gridGap={6}
                color="#ffffff"
                maxOpacity={0.5}
                flickerChance={0.1}
                width={dimensions.width}
                height={dimensions.height}
              />
              <div className="container mx-auto relative z-10">
                <div className="flex flex-col items-center space-y-4 text-center">
                  {/* <div className="relative h-[500px] rounded-lg w-full bg-background overflow-hidden border"></div> */}
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent text-white">
                    WPCopilot AI Powered Wordpress Copilot
                  </h1>
                  <p className="mx-auto max-w-[700px] text-white md:text-xl">
                    Elevate your WordPress experience with an AI agent who can
                    manage and develop your site with prompts.
                  </p>
                  {/* <div className="flex space-x-4">
                    <PulsatingButton pulseColor="#FFD700">
                      <Link href="/sites">
                        <Button
                          size="lg"
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          <span className="relative z-10">Get Started</span>
                          <ChevronRight
                            className={`ml-2 h-4 w-4 transition-transform inline-block ${
                              isHovering ? "translate-x-1" : ""
                            }`}
                          />
                        </Button>
                      </Link>
                    </PulsatingButton>

                    <CoolMode
                      options={{
                        particle:
                          "https://pbs.twimg.com/profile_images/1782811051504885763/YR5-kWOI_400x400.jpg",
                      }}
                    >
                      <Button size="lg">Learn More</Button>
                    </CoolMode>
                  </div> */}
                </div>
              </div>
            </section>

            <section className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6 bg-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-purple-500/5 opacity-50"></div>
              <div className="container mx-auto relative z-10">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-gray-100">
                  Supercharge Your WordPress Site
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                  Harness the power of AI to streamline your WordPress
                  development process. From content creation to performance
                  optimization, our intelligent assistant is here to
                  revolutionize your workflow.
                </p>
                <BentoGridWordpress />
              </div>
            </section>
          </main>

          <footer className="relative z-10 py-6 px-4 md:px-6 border-t border-gray-800 bg-gray-900">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Wordpress Copilot All rights reserved.
              </p>
              <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                <a
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  Contact
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
