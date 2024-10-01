// @ts-nocheck
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "server-only";

import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";

// import { BoardingPass } from "@/components/flights/boarding-pass";
// import { Destinations } from "@/components/flights/destinations";
// import { FlightStatus } from "@/components/flights/flight-status";
// import { ListFlights } from "@/components/flights/list-flights";
// import { PurchaseTickets } from "@/components/flights/purchase-ticket";
// import { SelectSeats } from "@/components/flights/select-seats";
// import { ListHotels } from "@/components/hotels/list-hotels";
import { Video } from "@/components/media/video";
import {
  AssistantMessage,
  UserMessage,
} from "@/components/pipelines/messages-ui";
import { BotCard, SpinnerMessage } from "@/components/stocks/message";
import { IconSpinner } from "@/components/ui/icons";
import { currentSite } from "@/data/site";
import { WP_PATH_RUN_SQL } from "@/lib/paths";
import prisma from "@/lib/prisma";
import { nanoid, sleep } from "@/lib/utils";
import { Chat, WpSite } from "@/types";
import {
  Artifact,
  ArtifactType,
  Message,
  Role,
  TextContentType,
  UserRequestCategoryType,
} from "@/types/export-pipeline";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamObject, streamText } from "ai";
import { error } from "console";
import { CheckIcon } from "lucide-react";
import { z } from "zod";
import {
  categorizeRequest,
  verifyHasSitePermissions,
} from "./extraction-pipeline";
import { executeWordPressSQL } from "./wp";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);
const perplexity = createOpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY ?? "",
  baseURL: "https://api.perplexity.ai/",
});

const openpipeOpenai = createOpenAI({
  apiKey: process.env.OPENPIPE_API_KEY ?? "",
  baseURL: "https://api.openpipe.ai/api/v1",
});

async function describeImage(imageBase64: string) {
  "use server";

  //   await rateLimit();

  const aiState = getMutableAIState();
  const spinnerStream = createStreamableUI(null);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  uiStream.update(
    <BotCard>
      <Video isLoading />
    </BotCard>
  );
  (async () => {
    try {
      let text = "";

      // attachment as video for demo purposes,
      // add your implementation here to support
      // video as input for prompts.
      if (imageBase64 === "") {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        text = `
      The books in this image are:

      1. The Little Prince by Antoine de Saint-Exupéry
      2. The Prophet by Kahlil Gibran
      3. Man's Search for Meaning by Viktor Frankl
      4. The Alchemist by Paulo Coelho
      5. The Kite Runner by Khaled Hosseini
      6. To Kill a Mockingbird by Harper Lee
      7. The Catcher in the Rye by J.D. Salinger
      8. The Great Gatsby by F. Scott Fitzgerald
      9. 1984 by George Orwell
      10. Animal Farm by George Orwell
      `;
      } else {
        const imageData = imageBase64.split(",")[1];

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const prompt = "List the books in this image.";
        const image = {
          inlineData: {
            data: imageData,
            mimeType: "image/png",
          },
        };

        const result = await model.generateContent([prompt, image]);
        text = result.response.text();
        console.log(text);
      }

      spinnerStream.done(null);
      messageStream.done(null);

      uiStream.done(
        <BotCard>
          <div>Video</div>
        </BotCard>
      );

      aiState.done({
        ...aiState.get(),
        interactions: [text],
      });
    } catch (e) {
      console.error(e);
      //   const error = new Error(
      //     "The AI got rate limited, please try again later."
      //   );
      uiStream.error(error);
      spinnerStream.error(error);
      messageStream.error(error);
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

async function submitUserMessage(content: string, siteId: string) {
  "use server";

  const site = (await currentSite(siteId)) as WpSite;

  const aiState = getMutableAIState<typeof AI>();
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: Role.USER,
        text: [
          {
            text: `${content}`,
            type: TextContentType.TEXT,
          },
        ],
        createdAt: new Date(),
      },
    ],
  });

  const textStream = createStreamableValue("");
  const loadingStream = createStreamableValue(true);
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const artifactStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  (async () => {
    try {
      let history = aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.text?.[0]?.text || "",
        name: message.name || "",
      }));
      const category = await categorizeRequest({
        content,
        messages: history,
      });
      console.log("category", category);
      if (category === UserRequestCategoryType.DATA_EXTRACTION) {
        const hasPermissions = verifyHasSitePermissions(site);
        if (!hasPermissions) {
          const error = new Error(
            "We cannot access your wordpress site. Please ensure our plugin is installed with a valid api key."
          );
          uiStream.error(error);
          textStream.error(error);
          messageStream.error(error);
          return;
        } else {
          // generate explanation and sql artifact in parallel
          const history = aiState.get().messages.map((message: any) => ({
            role: message.role,
            content: message.text?.[0]?.text || "",
            name: message.name || "",
          }));
          console.log("history", history);
          const objStream = await streamObject({
            model: openai("gpt-4o-mini"), // openpipeOpenai("gpt-4o-mini"),
            system: `
                Site Base URL: ${site?.base_url}
                Core Site Data: ${{}}
                
                Given the following user messages for data extraction from a WordPress site. Generate a SQL query that will extract the requested data. Consider the following:
                1. The query should be compatible with WordPress database structure.
                2. Include necessary JOINs to fetch data from related tables.
                3. Use appropriate WHERE clauses to filter data as per the user's request.
                4. Limit the result set if necessary to prevent overwhelming data volumes.
                5. Don't assume meta keys exist. 
                6. Query to return for more data, unless otherwise specified.
                7. When retrieving images, find the full url slug from the post attachment ID
                
                `,
            messages: history,
            schema: z.object({
              title: z.string().max(50),
              sqlQuery: z.string(),
              explanation: z.string(),
            }),
          });
          let artifact = {
            id: nanoid(),
            title: "",
            description: "",
            type: ArtifactType.SQL,
            content: [],
          } as Artifact;

          console.log("objStream", objStream);
          let objectOutput;
          for await (const partialObject of objStream.partialObjectStream) {
            objectOutput = partialObject;

            artifact = {
              ...artifact,
              title: partialObject.title!,
              content: [partialObject?.sqlQuery || ""],
              type: ArtifactType.SQL,
            };
            messageStream.update(
              <AssistantMessage
                content={partialObject.explanation || ""}
                artifacts={[artifact]}
              />
            );
          }

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: Role.ASSISTANT,
                text: [
                  {
                    text: `${objectOutput?.explanation}`,
                    type: TextContentType.TEXT,
                  },
                ],
                artifacts: [artifact],
                createdAt: new Date(),
              },
            ],
          });

          messageStream.update(
            <>
              <AssistantMessage
                content={objectOutput?.explanation || ""}
                artifacts={[artifact]}
              />
              <AssistantMessage
                content={`Running SQL Query:\n\n${objectOutput?.sqlQuery}`}
              />
            </>
          );
          const queryResult = await executeWordPressSQL({
            query: objectOutput?.sqlQuery!,
            api_key: site.api_key,
            api_url: `${site.base_url}${WP_PATH_RUN_SQL}`,
          });
          const queryResultArtifact = {
            id: nanoid(),
            title: "Query Result Table",
            description: objectOutput?.sqlQuery,
            content: [queryResult?.data],
            type: ArtifactType.JSON_TABLE,
          } as Artifact;

          messageStream.done(
            <>
              <AssistantMessage
                content={objectOutput?.explanation || ""}
                artifacts={[artifact]}
              />
              <AssistantMessage
                content={`Ran SQL Query to ${artifact.title}`}
                artifacts={[queryResultArtifact]}
              />
            </>
          );
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: Role.ASSISTANT,
                text: [
                  {
                    text: `${objectOutput?.explanation}`,
                    type: TextContentType.TEXT,
                  },
                ],
                artifacts: [queryResultArtifact],
                createdAt: new Date(),
              },
            ],
          });

          console.log({ queryResult });

          //   const generatedQuery = await generateQuery({
          //     site: site,
          //     user_request: content,
          //     core_site_data: {},
          //   });

          //   const generateQueryExplanation = await generateQueryExplanation();
          //   // then run the query

          // generate query result artifact
        }
        return;
      }

      const result = await streamText({
        model: perplexity("llama-3.1-sonar-large-128k-chat"), // openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-3.5-turbo"),
        system: `\
            You are an AI assistant for WordPress site management and development. You help users with tasks related to developing and managing their WordPress site.
        `,
        messages: [
          ...aiState.get().messages.map((message: any) => ({
            role: message.role,
            content: message.text?.[0]?.text || "",
            name: message.name || "",
          })),
        ],
        tools: {},
      });

      let textContent = "";
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        console.log({ delta });
        const { type } = delta;
        if (type === "text-delta") {
          const { textDelta } = delta;
          textContent += textDelta;
          messageStream.update(<AssistantMessage content={textContent} />);
        }
      }

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: Role.ASSISTANT,
            text: [
              {
                text: `${textContent}`,
                type: TextContentType.TEXT,
              },
            ],
            createdAt: new Date(),
          },
        ],
      });

      uiStream.done();
      textStream.done();
      messageStream.done();
      loadingStream.update(false);
      loadingStream.done();
      artifactStream.done();
      aiState.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        "The AI got rate limited, please try again later."
      );
      uiStream.error(error);
      textStream.error(error);
      messageStream.error(error);
      loadingStream.done();
      artifactStream.done();
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
    artifact: artifactStream.value,
    // loading: loadingStream.value,
  };
}

export async function requestCode() {
  "use server";

  const aiState = getMutableAIState();

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "assistant",
        content:
          "A code has been sent to user's phone. They should enter it in the user interface to continue.",
      },
    ],
  });

  const ui = createStreamableUI(
    <div className="animate-spin">
      <IconSpinner />
    </div>
  );

  (async () => {
    await sleep(2000);
    ui.done();
  })();

  return {
    status: "requires_code",
    display: ui.value,
  };
}

export async function validateCode() {
  "use server";

  const aiState = getMutableAIState();

  const status = createStreamableValue("in_progress");
  const ui = createStreamableUI(
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-zinc-500">
      <div className="animate-spin">
        <IconSpinner />
      </div>
      <div className="text-sm text-zinc-500">
        Please wait while we fulfill your order.
      </div>
    </div>
  );

  (async () => {
    await sleep(2000);

    ui.done(
      <div className="flex flex-col items-center text-center justify-center gap-3 p-4 text-emerald-700">
        <CheckIcon />
        <div>Payment Succeeded</div>
        <div className="text-sm text-zinc-600">
          Thanks for your purchase! You will receive an email confirmation
          shortly.
        </div>
      </div>
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          role: "assistant",
          content: "The purchase has completed successfully.",
        },
      ],
    });

    status.done("completed");
  })();

  return {
    status: status.value,
    display: ui.value,
  };
}

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    requestCode,
    validateCode,
    describeImage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    "use server";

    const user = await currentUser();

    if (user) {
      const aiState = getAIState();
      console.log("unstable_onGetUIState aiState", aiState);

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    const user = await currentUser();
    if (user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = user.id as string;
      const path = `/site/${chatId}`;
      const title = "TITLE PLACEHOLDER";
      //   messages[0].content.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path,
      };

      //   await saveChat(chat);
    } else {
      return;
    }
  },
});

export async function saveChat(chat: Chat) {
  const user = { id: 55555 };
  if (user) {
    // Save to KV cache
    // const pipeline = kv.pipeline();
    // pipeline.hmset(`chat:${chat.id}`, chat);
    // pipeline.zadd(`user:chat:${chat.userId}`, {
    //   score: Date.now(),
    //   member: `chat:${chat.id}`,
    // });
    // await pipeline.exec();
    // Save or update in Prisma database
    // Upsert the chat
    await prisma.chat.upsert({
      where: { id: chat.id },
      update: {
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId,
        path: chat.path,
      },
      create: {
        id: chat.id,
        title: chat.title,
        userId: chat.userId,
        siteId: chat.siteId || "",
        path: chat.path,
      },
    });

    // Get existing messages for this chat
    // const existingMessages = await prisma.message.findMany({
    //   where: { chatId: chat.id },
    //   select: { id: true },
    // });

    // Create new messages and update existing ones
    // const upsertPromises = chat.messages.map((message) =>
    //   prisma.message.upsert({
    //     where: { id: message.id },
    //     update: {
    //       content:
    //         typeof message.content === "string"
    //           ? message.content
    //           : message.content !== null
    //           ? JSON.stringify(message.content)
    //           : "",
    //       role: message.role,
    //       siteId: chat.siteId!,
    //     },
    //     create: {
    //       id: message.id as string,
    //       chatId: chat.id,
    //       content:
    //         typeof message.content === "string"
    //           ? message.content
    //           : message.content !== null
    //           ? JSON.stringify(message.content)
    //           : "",
    //       role: message.role,
    //       siteId: chat.siteId || "4z",
    //     },
    //   })
    // );

    // await Promise.all(upsertPromises);

    // // Delete messages that are no longer relevant
    // const currentMessageIds = new Set(chat.messages.map((m) => m.id));
    // const messagesToDelete = existingMessages.filter(
    //   (m) => !currentMessageIds.has(m.id)
    // );

    // if (messagesToDelete.length > 0) {
    //   await prisma.message.deleteMany({
    //     where: {
    //       id: { in: messagesToDelete.map((m) => m.id) },
    //     },
    //   });
    // }
    return;
  } else {
    return;
  }
}

export const getUIStateFromAIState = (aiState: any) => {
  return aiState.messages
    .filter((message: Message) => message.role !== Role.SYSTEM)
    .map((message: Message, index: number) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === Role.ASSISTANT ? (
          <AssistantMessage
            content={message?.text?.[0]?.text}
            artifacts={message.artifacts}
          />
        ) : message.role === Role.USER ? (
          <UserMessage content={message.text?.[0]?.text}></UserMessage>
        ) : null,
    }));
};
