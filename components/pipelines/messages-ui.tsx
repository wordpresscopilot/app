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
import { Artifact, Message, Role } from "@/types/export-pipeline";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";

export function MessagesUI() {
  const { isSubmitting, error, aiState, messages } = useExportContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto min-h-full grow p-4 pr-0 max-h-full pb-[112px]">
      {messages.map((message: any, index: number) => {
        return <>{message?.display}</>;
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export const UserMessage = ({ content }: { content: string }) => {
  return (
    <div
      className={cn(
        "flex gap-2 border border-border rounded-lg py-4 px-3 backdrop-brightness-80"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <UserAvatar />
          {content}
        </div>
      </div>
    </div>
  );
};
export const AssistantMessage = ({
  content,
  artifacts,
}: {
  content: string;
  artifacts?: Artifact[];
}) => {
  return (
    <div
      className={cn(
        "flex gap-2 border border-border rounded-lg py-4 px-3 backdrop-brightness-90"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <SystemAvatar />
          {content}
        </div>
        {artifacts?.length ? (
          <div className="flex flex-row gap-4">
            {artifacts?.map((artifact, index) => (
              <ArtifactCard key={index} artifact={artifact} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const MessageUI = ({ message }: { message: any }) => {
  return (
    <div
      className={cn(
        "flex gap-2 border border-border rounded-lg py-4 px-3",
        message.role === Role.SYSTEM || message.role === Role.ASSISTANT
          ? "backdrop-brightness-90"
          : "backdrop-brightness-50"
      )}
    >
      {message?.role === Role.USER ? <UserAvatar /> : null}
      {message?.role === Role.SYSTEM ? <SystemAvatar /> : null}
      {message?.role === Role.ASSISTANT ? <SystemAvatar /> : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">{message?.text?.[0]?.text}</div>
        {message.artifacts && (
          <div className="flex flex-col gap-3">
            {message.artifacts.map((artifact: Artifact, index: number) => (
              <ArtifactCard key={index} artifact={artifact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const LoadingMessage = () => (
  <div className="flex gap-2 border border-border rounded-lg py-4 px-3 backdrop-brightness-90">
    <SystemAvatar />
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 size={16} className="animate-spin mt-[2.5px]" />
      <span>Thinking...</span>
    </div>
  </div>
);

export const ErrorMessage = ({ error }: { error: string }) => {
  const { messages, setMessages, onSubmit, isSubmitting } = useExportContext();

  const handleTryAgain = () => {
    const lastUserMessageIndex = messages.findLastIndex(
      (message: Message) => message.role === Role.USER
    );

    if (lastUserMessageIndex === -1) {
      toast.error("No user message to try again.");
      return;
    }

    const lastUserMessageText = messages[lastUserMessageIndex].text[0].text;

    if (lastUserMessageText) {
      setMessages((prev: any) => prev.slice(0, lastUserMessageIndex));
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

export const ArtifactCard = ({ artifact }: { artifact: Artifact }) => {
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
