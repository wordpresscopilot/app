"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveArtifact } from "@/contexts/active-artifact";
import { nanoid } from "@/lib/utils";
import { WpSite } from "@/types";
import { Artifact, ArtifactType, ToolType } from "@/types/export-pipeline";
import { Computer, Globe2Icon, Pencil, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
interface WpSiteHeaderProps {
  site: WpSite;
}

export default function SiteHeader({ site }: WpSiteHeaderProps) {
  const { activeArtifact, setActiveArtifact } = useActiveArtifact();

  useEffect(() => {
    const init = async () => {
      setActiveArtifact(await createSiteArtifact());
    };
    init();
  }, []);

  const createSiteArtifact = async () => {
    // const adminAutoLoginLink = await getAdminAutoLoginLink(site.id);
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

  const tooltipActions = [
    // {
    //   icon: <RefreshCw className="h-4 w-4" />,
    //   tooltip: "Refresh site",
    //   onClick: () => console.log("Refresh site"),
    //   disabled: true,
    // },
    {
      icon: <RefreshCw className="h-4 w-4" />,
      tooltip: "Flush Cache",
      onClick: () => console.log("Refresh site"),
      disabled: true,
    },
    {
      icon: <Pencil className="h-4 w-4" />,
      tooltip: "Edit site",
      onClick: () => console.log("Edit site"),
      disabled: true,
    },
    {
      icon: <Computer className="h-4 w-4" />,
      tooltip: "Open Playground",
      disabled: true,
      onClick: async () => {
        if (activeArtifact?.type === ArtifactType.PLAYGROUND) {
          setActiveArtifact(null);
        } else {
          setActiveArtifact(await createPlaygroundArtifact());
        }
      },
    },
    {
      icon: <Globe2Icon className="h-4 w-4" />,
      tooltip: "Show Site",
      onClick: async () => {
        if (activeArtifact?.type === ArtifactType.SITE) {
          setActiveArtifact(null);
        } else {
          setActiveArtifact(await createSiteArtifact());
        }
      },
    },
  ];

  return (
    <header className="flex items-centerw-full bg-background border-b relative overflow-hidden">
      <Image
        src="/landing/hero.webp"
        alt="hero"
        width={100}
        height={100}
        className="object-cover absolute inset-0 w-full h-full z-10 rounded-md"
      />
      <div className="flex items-center justify-between w-full px-4 py-2 z-50">
        <h1 className="text-2xl font-bold z-50 text-white">
          {site?.name || "Demo Site"}
        </h1>
        {/* <div className="flex items-center gap-2">
          {tooltipActions.slice(0, 2).map((action, index) => (
            <TooltipProvider key={index} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={action.disabled ? undefined : action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div> */}
        <div className="flex items-center gap-2 z-50">
          {tooltipActions.map((action, index) => (
            <TooltipProvider key={index} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={action.disabled ? undefined : action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </header>
  );
}
