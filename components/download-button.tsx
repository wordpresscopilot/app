"use client";
import { Button } from "@/components/ui/button";
import React from "react";

interface DownloadButtonProps {
  data: object;
  filename?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  filename = "data.json",
}) => {
  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleDownload}>Download JSON</Button>;
};
