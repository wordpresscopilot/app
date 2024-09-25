"use client";

import { useExportContext } from "@/components/pipelines/provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Artifact,
  Messages,
  Role,
  TextContentType,
} from "@/types/export-pipeline";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function MessagesUI() {
  const { isSubmitting, messages, error } = useExportContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto min-h-full grow p-4 pr-0 max-h-full pb-[112px]">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isSubmitting && <LoadingMessage />}
      {error && <ErrorMessage error={error} />}
      <div ref={messagesEndRef} />
    </div>
  );
}

const Message = ({ message }: { message: Messages }) => {
  return (
    <div
      className={cn(
        "flex gap-2 border border-border rounded-lg py-4 px-3",
        message.role === "system"
          ? "backdrop-brightness-90"
          : "backdrop-brightness-50"
      )}
    >
      {message.role === "system" ? <SystemAvatar /> : <UserAvatar />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {message.text.map((text, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-2 text-sm",
                index === 0 ? (text.title ? "pt-[3px]" : "pt-[6px]") : null
              )}
            >
              {text.title && (
                <div className="text-base font-semibold">{text.title}</div>
              )}
              {text.type === TextContentType.TEXT ? (
                <div>{text.text}</div>
              ) : (
                <div>{text.text}</div>
              )}
            </div>
          ))}
        </div>
        {message.artifacts && (
          <div className="flex flex-col gap-3">
            {message.artifacts.map((artifact, index) => (
              <ArtifactCard key={index} artifact={artifact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingMessage = () => (
  <div className="flex gap-2 border border-border rounded-lg py-4 px-3 backdrop-brightness-90">
    <SystemAvatar />
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 size={16} className="animate-spin mt-[2.5px]" />
      <span>Thinking...</span>
    </div>
  </div>
);

const ErrorMessage = ({ error }: { error: string }) => {
  const { messages, setMessages, onSubmit, isSubmitting } = useExportContext();

  const handleTryAgain = () => {
    const lastUserMessageIndex = messages.findLastIndex(
      (message) => message.role === Role.USER
    );

    if (lastUserMessageIndex === -1) {
      toast.error("No user message to try again.");
      return;
    }

    const lastUserMessageText = messages[lastUserMessageIndex].text[0].text;

    if (lastUserMessageText) {
      setMessages((prev) => prev.slice(0, lastUserMessageIndex));
      onSubmit({ userRequest: lastUserMessageText });
    }
  };

  return (
    <div className="flex gap-2 border border-border rounded-lg py-4 px-3 backdrop-brightness-90">
      <SystemAvatar />
      <div className="flex items-center gap-2 text-sm text-red-500 font-semibold">
        <span>Error: {error}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-500 hover:text-blue-600 transition-colors"
          onClick={handleTryAgain}
          disabled={isSubmitting}
        >
          Try again
        </Button>
      </div>
    </div>
  );
};

const ArtifactCard = ({ artifact }: { artifact: Artifact }) => {
  const { activeArtifact, setActiveArtifact } = useExportContext();

  return (
    <Card
      onClick={() => setActiveArtifact(artifact)}
      className={cn(
        "cursor-pointer w-fit",
        activeArtifact?.id === artifact.id &&
          "bg-muted ring-1 ring-slate-800 dark:ring-slate-100 transition-all duration-300"
      )}
    >
      <CardHeader className="py-3 space-y-1">
        <CardTitle className="text-base font-semibold">
          {artifact.title}
        </CardTitle>
        <CardDescription>{artifact.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const SystemAvatar = () => (
  <div className="flex items-center justify-center h-8 w-8 min-h-8 min-w-8 bg-muted rounded-full">
    <Image src="/logo/logo-color.svg" alt="system" width={24} height={24} />
  </div>
);

const UserAvatar = () => (
  <Avatar className="h-8 w-8 min-h-8 min-w-8 bg-muted">
    <AvatarImage src="" />
    <AvatarFallback>
      <User size={24} />
    </AvatarFallback>
  </Avatar>
);
