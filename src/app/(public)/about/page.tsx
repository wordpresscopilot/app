"use client";
import { BentoGridWordpress } from "@/components/bento-grid-wordpress";
import { CoolMode } from "@/components/magicui/cool-mode";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import PulsatingButton from "@/components/magicui/pulsating-button";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="flex flex-col min-h-screen bg-foreground overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzYTNhM2EiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10 animate-pulse"></div>
      </div>

      <header className="relative z-10 px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <a className="flex items-center justify-center gap-1" href="#">
          <Image src="/logo.png" width={54} height={54} alt={config.siteName} />

          <span className="text-xl font-bold bg-clip-text text-transparent text-white light:text-black">
            {config.siteName}
          </span>
        </a>
        <nav className="ml-auto flex items-center gap-6">
          <a
            className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            href="#"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            href="#"
          >
            Docs
          </a>
          <a
            className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            href="#"
          >
            Pricing
          </a>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-primary transition-colors"
          >
            Log In
          </Button>
        </nav>
      </header>

      <main className="relative z-10 flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 relative">
          <FlickeringGrid
            className="absolute inset-0"
            squareSize={4}
            gridGap={6}
            color="#00b4d8"
            maxOpacity={0.5}
            flickerChance={0.1}
            width={dimensions.width}
            height={dimensions.height}
          />
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              {/* <div className="relative h-[500px] rounded-lg w-full bg-background overflow-hidden border"></div> */}
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent text-white">
                AI-Powered WordPress
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Elevate your WordPress experience with an AI agent who can
                manage and develop your site with prompts.
              </p>
              <div className="flex space-x-4">
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
              </div>
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
              Harness the power of AI to streamline your WordPress development
              process. From content creation to performance optimization, our
              intelligent assistant is here to revolutionize your workflow.
            </p>
            <BentoGridWordpress />
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-6 px-4 md:px-6 border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 w-p.ai All rights reserved.
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
  );
}
