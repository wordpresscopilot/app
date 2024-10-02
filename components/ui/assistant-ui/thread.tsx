"use client";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  BranchPickerPrimitiveRootProps,
  ComposerPrimitive,
  getExternalStoreMessage,
  MessagePrimitive,
  ThreadPrimitive,
  useMessage,
} from "@assistant-ui/react";
import { useState, type FC } from "react";

import { SpinnerMessage } from "@/components/stocks/message";
import { MarkdownText } from "@/components/ui/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/ui/assistant-ui/tooltip-icon-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useActiveArtifact } from "@/contexts/active-artifact";
import { cn } from "@/lib/utils";
import {
  Artifact,
  ArtifactType,
  getArtifactIcon,
  Message,
  ToolType,
} from "@/types/export-pipeline";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  StopCircleIcon,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import ThreadSuggestion from "./thread-suggestion";

export const MyThread: FC = () => {
  return (
    <ThreadPrimitive.Root className="bg-background h-[calc(100vh-160px)]">
      <ThreadPrimitive.Viewport className="flex flex-col h-full items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <MyThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: MyUserMessage,
            EditComposer: MyEditComposer,
            AssistantMessage: MyAssistantMessage,
          }}
        />
        <div className="sticky bottom-0 mt-4 flex w-full max-w-2xl flex-grow flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          {/* <ThreadPrimitive.If empty={false}>
            <div className="mb-4 w-full px-4">
              <div className="flex flex-wrap justify-center gap-4">
                <ThreadPrimitive.If running={false}>
                  <AI_ThreadSuggestion></AI_ThreadSuggestion>
                </ThreadPrimitive.If>
              </div>
            </div>
          </ThreadPrimitive.If> */}
          <MyThreadScrollToBottom />
          <MyComposer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const MyThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const MyThreadWelcome: FC = () => {
  return (
    // <ThreadPrimitive.Empty>
    //   <div className="flex flex-grow basis-full flex-col items-center justify-center">
    //     <Avatar>
    //       <AvatarFallback>WPC</AvatarFallback>
    //     </Avatar>
    //     <p className="mt-4 font-medium">How can I help you today?</p>
    //   </div>
    // </ThreadPrimitive.Empty>
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-2xl grow flex-col px-4 py-6">
        <div className="flex flex-grow basis-full flex-col items-center justify-center">
          <h1 className="leading-tighter mb-4 text-center text-5xl font-extrabold tracking-tighter md:text-6xl">
            <span className="bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent">
              Try me.
            </span>
          </h1>
        </div>
        <div className="mb-4 w-full px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <ThreadSuggestion prompt="Show me all the plugins on my site.">
              <p className="font-semibold">
                Show me all the plugins on my site.
              </p>
            </ThreadSuggestion>
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const MyComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-aui-ring/20 flex w-full flex-wrap items-end rounded-lg border px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>
  );
};

const MyUserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <MyUserActionBar />

      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>

      <MyBranchPicker className="col-span-full col-start-1 row-start-2 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const MyUserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 mr-3 mt-2.5 flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const MyEditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none border-none bg-transparent p-4 pb-0 outline-none focus:ring-0" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AskForPermissionArtifact: FC = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const message = useMessage((m) =>
    getExternalStoreMessage<Message>(m.message)
  );
  if (!message?.artifacts || message.artifacts.length === 0) {
    return null;
  }
  const artifact = message?.artifacts?.[0];
  if (artifact?.toolName !== ToolType.ASK_FOR_PERMISSION) return;
  if (artifact?.isError) return;
  return (
    <div className="mt-4 bg-muted rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-2">{artifact.title}</p>
      <p className="text-sm mb-4">{artifact.description}</p>
      <div className="flex gap-2">
        <ThreadPrimitive.Suggestion
          prompt={"Permission Granted" || ""}
          method="replace"
          autoSend
          asChild
          disabled={buttonClicked}
        >
          <Button
            size="sm"
            disabled={buttonClicked}
            onClick={() => setButtonClicked(true)}
          >
            Grant Permission
          </Button>
        </ThreadPrimitive.Suggestion>
      </div>
    </div>
  );
};

const ViewableArtifacts: FC = () => {
  const { setActiveArtifact } = useActiveArtifact();
  const message = useMessage((m) =>
    getExternalStoreMessage<Message>(m.message)
  );
  if (!message?.artifacts || message.artifacts.length === 0) {
    return null;
  }
  const show = message.artifacts.some((artifact) => {
    if (artifact?.toolName === ToolType.ASK_FOR_PERMISSION) return false;
    if (artifact?.toolName === ToolType.SHOW_SITE) return false;
    if (artifact?.isError) return false;
    return true;
  });

  if (!show) return null;

  return (
    <div className="mt-4 space-y-4">
      {message.artifacts.map((artifact: Artifact, index) => {
        if (artifact?.content?.length === 0) return;
        return (
          <div key={index}>
            <Card
              className={`cursor-pointer bg-muted/50 hover:bg-muted transition-colors ${
                artifact.isError ? "border-red-500 border-2" : ""
              }`}
              onClick={() => {
                setActiveArtifact(artifact);
                console.log("Artifact clicked:", artifact);
              }}
            >
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <div>
                    {React.createElement(getArtifactIcon(artifact.type))}
                  </div>
                  <div>{artifact.title}</div>
                </CardTitle>
                <CardDescription className="text-xs">
                  {artifact.description}
                </CardDescription>
              </CardHeader>
              {/* <CardFooter></CardFooter> */}
            </Card>
            {artifact.toolName === ToolType.GENERATE_PAGE && (
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const playgroundArtifact = {
                      ...artifact,
                      type: ArtifactType.PLAYGROUND,
                    } as Artifact;
                    setActiveArtifact(playgroundArtifact);
                  }}
                >
                  View in Playground
                </Button>
              </CardFooter>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ErrorArtifact: FC = () => {
  const message = useMessage((m) =>
    getExternalStoreMessage<Message>(m.message)
  );
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});

  if (!message?.artifacts || message.artifacts.length === 0) {
    return null;
  }

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="mt-4 space-y-4">
      {message.artifacts.map((artifact, index) => {
        if (!artifact?.isError) return null;
        return (
          <Card
            key={index}
            className={`cursor-pointer hover:bg-muted/80 transition-colors ${
              artifact.isError ? "border-red-500 border-2" : ""
            }`}
            onClick={() => toggleCard(index)}
          >
            <CardHeader>
              <CardTitle className="text-sm">{artifact.title}</CardTitle>
              <CardDescription className="text-xs">
                {artifact.description}
              </CardDescription>
            </CardHeader>
            {expandedCards[index] && artifact?.content?.length > 0 && (
              <CardContent>
                <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(artifact.content, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

const MyAssistantMessage: FC = () => {
  return (
    <>
      <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr_auto] py-4">
        <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
          <AvatarImage src={"/logo/logo-color.svg"}></AvatarImage>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>

        <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
          <MessagePrimitive.Content
            components={{ Empty: MyEmpty, Text: MarkdownText }}
          />
        </div>

        <MyAssistantActionBar />

        <MyBranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />

        <div className="col-span-2 col-start-2 row-start-3">
          {/* <SQLArtifact /> */}
          <ViewableArtifacts />
          <AskForPermissionArtifact />
          <ErrorArtifact />
        </div>
      </MessagePrimitive.Root>
    </>
  );
};

const MyEmpty: FC = () => {
  return <SpinnerMessage />;
};

const MyAssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      {/* <MessagePrimitive.If speaking={false}>
        <ActionBarPrimitive.Speak asChild>
          <TooltipIconButton tooltip="Read aloud">
            <AudioLinesIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.Speak>
      </MessagePrimitive.If> */}
      <MessagePrimitive.If speaking>
        <ActionBarPrimitive.StopSpeaking asChild>
          <TooltipIconButton tooltip="Stop">
            <StopCircleIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.StopSpeaking>
      </MessagePrimitive.If>
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const MyBranchPicker: FC<BranchPickerPrimitiveRootProps> = ({
  className,
  ...rest
}) => {
  return (
    <ThreadPrimitive.If running={false}>
      <BranchPickerPrimitive.Root
        hideWhenSingleBranch
        className={cn(
          "text-muted-foreground inline-flex items-center text-xs",
          className
        )}
        {...rest}
      >
        <BranchPickerPrimitive.Previous asChild>
          <TooltipIconButton tooltip="Previous">
            <ChevronLeftIcon />
          </TooltipIconButton>
        </BranchPickerPrimitive.Previous>
        <span className="font-medium">
          <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
        </span>
        <BranchPickerPrimitive.Next asChild>
          <TooltipIconButton tooltip="Next">
            <ChevronRightIcon />
          </TooltipIconButton>
        </BranchPickerPrimitive.Next>
      </BranchPickerPrimitive.Root>
    </ThreadPrimitive.If>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
