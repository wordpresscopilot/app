import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Toaster position="top-center" />
      <Providers
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <header className="bg-background z-20 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Navigation />
        </header>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-6 lg:p-3 lg:gap-4 xl:p-4">
          {children}
        </main>
        <TailwindIndicator />
      </Providers>
    </div>
  );
}
