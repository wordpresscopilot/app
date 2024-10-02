"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveArtifact } from "@/contexts/active-artifact";
import { getAdminAutoLoginLink } from "@/data/site";
import { nanoid } from "@/lib/utils";
import { WpSite } from "@/types";
import { Artifact, ArtifactType, ToolType } from "@/types/export-pipeline";
import { Computer, Globe2Icon, Pencil, RefreshCw } from "lucide-react";

interface WpSiteHeaderProps {
  site: WpSite;
}

export default function SiteHeader({ site }: WpSiteHeaderProps) {
  const { activeArtifact, setActiveArtifact } = useActiveArtifact();
  const createSiteArtifact = async () => {
    const adminAutoLoginLink = await getAdminAutoLoginLink(site.id);
    console.log({ adminAutoLoginLink });
    let artifact = {
      id: nanoid(),
      title: "Show Site",
      description: site?.base_url,
      type: ArtifactType.SITE,
      toolName: ToolType.SHOW_SITE,
      content: [site?.base_url],
    } as Artifact;
    return artifact;
  };
  const createPlaygroundArtifact = async () => {
    let artifact = {
      id: nanoid(),
      title: "Site Playground",
      description: "",
      type: ArtifactType.PLAYGROUND,
      toolName: ToolType.SHOW_SITE,
      content: [],
    } as Artifact;
    return artifact;
  };
  return (
    <header className="flex items-centerw-full bg-background border-b">
      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Refresh site</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Edit site</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    if (activeArtifact?.type === ArtifactType.PLAYGROUND) {
                      setActiveArtifact(null);
                    } else {
                      setActiveArtifact(await createPlaygroundArtifact());
                    }
                  }}
                >
                  <Computer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Open Playground</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    if (activeArtifact?.type === ArtifactType.SITE) {
                      setActiveArtifact(null);
                    } else {
                      setActiveArtifact(await createSiteArtifact());
                    }
                  }}
                >
                  <Globe2Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Show Site</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
