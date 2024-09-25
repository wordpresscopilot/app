"use client";

import { ArtifactUI } from "@/components/pipelines/artifact-ui";
import ExportForm from "@/components/pipelines/export-form";
import { MessagesUI } from "@/components/pipelines/messages-ui";
import { ExportProvider } from "@/components/pipelines/provider";
import { WpSite } from "@/types";

export function ExportUI({
  site,
  coreSiteData,
}: {
  site: WpSite;
  coreSiteData: any;
}) {
  return (
    <ExportProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full max-h-full overflow-hidden">
        <div className="relative col-span-1 h-full max-h-[calc(100vh-64px)] flex flex-col">
          <div className="grow overflow-y-auto p-4 max-h-full pb-[112px]">
            <MessagesUI />
          </div>
          <div className="h-[96px] max-h-[96px] absolute bottom-0 left-0 right-0 bg-muted backdrop-brightness-25 rounded-t-lg border-t-2 border-l-2 border-r-2 border-border p-4 drop-shadow-lg">
            <ExportForm site={site} coreSiteData={coreSiteData} />
          </div>
        </div>
        <div className="col-span-1 pt-4">
          <ArtifactUI />
        </div>
      </div>
    </ExportProvider>
  );
}
