"use client";

import { IconOpenAI, IconUser } from "@/components/ui/icons";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import { useStreamableText } from "@/hooks/use-streamable-text";
import { cn } from "@/lib/utils";
import { StreamableValue } from "ai/rsc";
import { Settings2Icon } from "lucide-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "../ui/codeblock";
import { spinner } from "./spinner";

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="font-semibold ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  );
}

export function ToolMessage({
  content,
  showAvatar = true,
  className,
}: {
  content: string | StreamableValue<string>;
  showAvatar?: boolean;
  className?: string;
}) {
  const text = useStreamableText(content);
}

export function BotMessage({
  content,
  showAvatar = true,
  className,
}: {
  content: string | StreamableValue<string>;
  showAvatar?: boolean;
  className?: string;
}) {
  const text = useStreamableText(content);
  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node?: any; // Make node optional
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) {
              if (children) {
                if (typeof children === "string" && children.startsWith("▍")) {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  );
                }

                if (
                  Array.isArray(children) &&
                  typeof children[0] === "string"
                ) {
                  children = [
                    children[0].replace("`▍`", "▍"),
                    ...children.slice(1),
                  ];
                }
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
            // code(props) {
            //   const { children, className, node, ...rest } = props;
            //   const match = /language-(\w+)/.exec(className || "");
            //   const { ref, ...restWithoutRef } = rest; // Remove ref from rest
            //   return match ? (
            //     <SyntaxHighlighter
            //       {...restWithoutRef}
            //       language={match[1]}
            //       style={dark}
            //       PreTag="div"
            //     >
            //       {String(children)}
            //     </SyntaxHighlighter>
            //   ) : (
            //     <code {...rest} className={className}>
            //       {children}
            //     </code>
            //   );
            // },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}
export function ToolCommandCard({ command }: { command: string }) {
  return (
    <div className="max-w-3xl w-full">
      <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
        <code className="text-sm font-mono">{command}</code>
      </pre>
    </div>
  );
}

export function ToolCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12 mt-2">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center gap-2 justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <Settings2Icon />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center gap-2 justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}
