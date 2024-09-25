"use client";

import { useExportContext } from "@/components/pipelines/provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function MessagesUI() {
  const { messages, activeArtifact, setActiveArtifact } = useExportContext();

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-2 border border-border rounded-lg py-4 px-3",
            message.role === "system"
              ? "backdrop-brightness-90"
              : "backdrop-brightness-50"
          )}
        >
          {message.role === "system" ? <SystemAvatar /> : <UserAvatar />}
          <div className="flex flex-col gap-4 pt-[3px]">
            {Array.isArray(message.text) ? (
              <div className="flex flex-col gap-2">
                {message.text.map((text, index) => (
                  <div key={index}>{text}</div>
                ))}
              </div>
            ) : (
              <div className="">{message.text}</div>
            )}
            {message.artifacts && (
              <div className="flex flex-col gap-3">
                {message.artifacts.map((artifact, index) => (
                  <Card
                    key={index}
                    onClick={() => setActiveArtifact(artifact)}
                    className={cn(
                      "cursor-pointer",
                      activeArtifact?.id === artifact.id &&
                        "bg-muted ring-1 ring-slate-800 dark:ring-slate-100 transition-all duration-300"
                    )}
                  >
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">{artifact.name}</CardTitle>
                      <CardDescription>{artifact.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const SystemAvatar = () => (
  <div className="flex items-center justify-center h-8 w-8 bg-muted rounded-full">
    <Image src="/logo/logo-color.svg" alt="system" width={24} height={24} />
  </div>
);

const UserAvatar = () => (
  <Avatar className="h-8 w-8 bg-muted">
    <AvatarImage src="" />
    <AvatarFallback>
      <User size={24} />
    </AvatarFallback>
  </Avatar>
);
