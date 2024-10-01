import { Footer } from "@/components/footer";
import { MarketingNavigation } from "@/components/marketing-navigation";
import PluginDownloadCard from "@/components/plugin-download-card";

export default async function PluginPage() {
  return (
    <div className="p-3 md:p-5 flex flex-col gap-2.5 max-w-[1440px] xl:min-w-[1440px] mx-auto min-h-[100vh]">
      <main className="w-full flex flex-col gap-2.5">
        <MarketingNavigation />
        <div className="my-8">
          <PluginDownloadCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
