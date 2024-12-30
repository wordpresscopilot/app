import { AssistantUI } from "@/components/assistantui";
import { LocalRuntimeProvider } from "@/components/assistantui/local-runtime";
import { MarketingNavigation } from "@/components/marketing-navigation";
import SiteHeader from "@/components/site-header";
import { ActiveArtifactProvider } from "@/contexts/active-artifact";
import prisma from "@/lib/prisma";
import { WpSite } from "@/types";
export default async function DemoPage() {
  const site = (await prisma.wp_site.findUnique({
    where: {
      id: "demo",
    },
  })) as WpSite;
  return (
    <ActiveArtifactProvider>
      <LocalRuntimeProvider site={site}>
        <div className="p-3 md:p-5 flex flex-col gap-2.5 w-full max-w-[1440px] mx-auto min-h-[100vh]">
          <main className="flex flex-col gap-2.5">
            <MarketingNavigation />
            <SiteHeader site={site} />
            <AssistantUI />
          </main>
        </div>
      </LocalRuntimeProvider>
    </ActiveArtifactProvider>
  );

  //     <div className="p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] w-full mx-auto min-h-[100vh]">
  //       <main className="flex flex-col gap-2.5">
  //         <MarketingNavigation />
  //         <section className="w-full relative overflow-hidden rounded-md bg-black">
  //           <Image
  //             src="/landing/hero.webp"
  //             alt="hero"
  //             width={100}
  //             height={100}
  //             fetchPriority="high"
  //             decoding="async"
  //             className="object-cover"
  //             style={{
  //               position: "absolute",
  //               height: "100%",
  //               width: "100%",
  //               left: 0,
  //               top: 0,
  //               right: 0,
  //               bottom: 0,
  //               color: "transparent",
  //             }}
  //           />
  //         </section>
  //       </main>
  //     </div>
  //   );
}
