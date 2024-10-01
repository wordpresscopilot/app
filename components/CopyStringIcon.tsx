"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CopyStringIcon({
  stringToCopy,
  successText,
}: {
  stringToCopy: string;
  successText?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(stringToCopy);
      toast.success(successText || "Copied to clipboard");
      setCopied(true);
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
          {copied ? (
            <CheckIcon className="w-4 h-4 cursor-pointer transition-colors" />
          ) : (
            <CopyIcon
              className="w-4 h-4 cursor-pointer transition-colors text-muted-foreground hover:text-primary-foreground"
              onClick={copyAddress}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Click to copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
