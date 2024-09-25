"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export function CopyStringIcon({
  stringToCopy,
  successText,
}: {
  stringToCopy: string;
  successText?: string;
}) {
  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(stringToCopy);
      toast.success(successText || "Copied to clipboard");
    } catch (err: any) {
      toast.error("Failed to copy", {
        description: err?.message || "Unknown error",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CopyIcon
            className="w-4 h-4 cursor-pointer transition-colors text-muted-foreground hover:text-primary-foreground"
            onClick={copyAddress}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
