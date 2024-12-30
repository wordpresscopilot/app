import { Button } from "@/components/ui/button";
import { ThreadPrimitive } from "@assistant-ui/react";
import { readStreamableValue } from "ai/rsc";
import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { generate } from "./actions";
import { useLastAssistantMessage } from "./last-message-hook";

const AI_ThreadSuggestion: FC<PropsWithChildren<{}>> = ({ children }) => {
  const lastAssistantMessage = useLastAssistantMessage();
  const [output, setOutput] = useState<string | null>(null);
  const [output2, setOutput2] = useState<string | null>(null);

  const debounceRef = useRef(false);
  const generateSuggestions = useCallback(async (content: string) => {
    // do not send duplicate requests in React Strict Mode during development
    if (process.env.NODE_ENV === "development") {
      if (debounceRef.current) return;
      debounceRef.current = true;
      setTimeout(() => {
        debounceRef.current = false;
      }, 0);
    }
    const response1 = await generate(
      `Generate a very short task recommendation for what the user can do next based on this response: "${content}". Only return a direct question. It should be less than 10 words."`
    );

    // const [response1, response2] = await Promise.all([
    //   generate(
    //     `Generate a very short task recommendation button text based on this response: "${content}". Only return a direct question. It should be less than 10 words."`
    //   ),
    //   generate(
    //     `Generate a very short task recommendation button text based on this response: "${content}". Only return a direct question. It should be less than 10 words."`
    //   ),
    // ]);

    let generatedOutput = "";
    for await (const delta of readStreamableValue(response1.output)) {
      generatedOutput += delta;
    }
    setOutput(generatedOutput);

    // let generatedOutput2 = "";
    // for await (const delta of readStreamableValue(response2.output)) {
    //   generatedOutput2 += delta;
    // }
    // console.log(generatedOutput2);
    // setOutput2(generatedOutput2);
  }, []);

  useEffect(() => {
    const lastMessageContent = lastAssistantMessage?.content;
    const lastMessageString = JSON.stringify(lastMessageContent);
    generateSuggestions(lastMessageString);
  }, [lastAssistantMessage, generateSuggestions]);

  return (
    <div className="flex w-full space-x-2">
      <ThreadPrimitive.Suggestion
        prompt={output || ""}
        method="replace"
        autoSend
        asChild
      >
        <Button
          variant="outline"
          className="h-auto flex-1 p-2"
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {output || children}
        </Button>
      </ThreadPrimitive.Suggestion>
      {/* <ThreadPrimitive.Suggestion
        prompt={output2 || ""}
        method="replace"
        autoSend
        asChild
      >
        <Button
          variant="outline"
          className="h-auto flex-1 p-2"
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {output2 || children}
        </Button>
      </ThreadPrimitive.Suggestion> */}
    </div>
  );
};

const WrappedAI_ThreadSuggestion = () => {
  return (
    <ThreadPrimitive.If running={false}>
      <AI_ThreadSuggestion />
    </ThreadPrimitive.If>
  );
};

export default WrappedAI_ThreadSuggestion;
