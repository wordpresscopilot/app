import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Roboto_Mono as FontSans } from "next/font/google";
import "./globals.css";

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: "Open Source AI Agent Copilot",
  },
  description:
    "Connect to a wordpress site and use an LLM with tools to manage plugins, execute complex sql queries, run wp-cli commands, export data, and more. Built using NextJS, Shadcn, and AssistantUI.",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background text-foreground font-sans antialiased tracking-tighter",
            fontSans.variable
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <TailwindIndicator />
          </Providers>
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
