import { runWPSiteAgent } from '@/agents/wp-site-agent';
import { createRun, DataStreamEncoder } from 'assistant-stream';
import { fromAISDKStreamText } from 'assistant-stream/ai-sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const {messages, site } = await req.json();
  const filteredMessages = messages.map((message: any) => {
    if (Array.isArray(message.content)) {
      message.content = message.content.filter((content: any) => {
        if (content.type === 'tool-call' || content.type === 'tool-result') {
          return !(content.args && Object.keys(content.args).length === 0);
        }
        return true;
      });
    }
    return message;
  });

  const uniqueToolCallIds = new Set();

  const deduplicatedMessages = filteredMessages.map((message: any) => {
    if (Array.isArray(message.content)) {
      message.content = message.content.filter((content: any) => {
        if (content.type === 'tool-result') {
          if (uniqueToolCallIds.has(content.toolCallId)) {
            return false;
          }
          uniqueToolCallIds.add(content.toolCallId);
        }
        return true;
      });
    }
    return message;
  });

  
  const stream = createRun(async (controller) => {
  

    const agentResult = await runWPSiteAgent({ site, messages: deduplicatedMessages });
    // @ts-ignore
    controller.appendStep(fromAISDKStreamText(agentResult.fullStream));

    // const result2 = await streamObject({
    //   model: openai("gpt-4o"),
    //   prompt: "Response with hello world",
    //   schema: z.object({
    //     text: z.string(),
    //   }),
    // });
    // controller.addStep(
    //   fromAISDKStreamObject(result2.fullStream, "hello_world")
    // );
  });

  return stream.toResponse(new DataStreamEncoder());
}