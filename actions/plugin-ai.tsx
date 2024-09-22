import "server-only";

import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";

import { saveChat } from "@/actions";
import { BotMessage } from "@/components/stocks";
import { SpinnerMessage, UserMessage } from "@/components/stocks/message";
import { CheckIcon, IconSpinner } from "@/components/ui/icons";
import { rateLimit } from "@/lib/ratelimit";
import { nanoid, sleep } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamText } from "ai";
import { format } from "date-fns";
import { Chat, Message, Plugin } from "../types";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

// async function describeImage(imageBase64: string) {
//   "use server";

//   await rateLimit();

//   const aiState = getMutableAIState();
//   const spinnerStream = createStreamableUI(null);
//   const messageStream = createStreamableUI(null);
//   const uiStream = createStreamableUI();

//   uiStream.update(
//     <BotCard>
//       <Video isLoading />
//     </BotCard>
//   );
//   (async () => {
//     try {
//       let text = "";

//       // attachment as video for demo purposes,
//       // add your implementation here to support
//       // video as input for prompts.
//       if (imageBase64 === "") {
//         await new Promise((resolve) => setTimeout(resolve, 5000));

//         text = `
//           You are an AI assistant for WordPress site management and development. You help users with tasks related to developing their WordPress site.

//           You have the ability to:
//           1. execute SQL queries on the WordPress database to assist users.
//           2. execute bash scripts on the WordPress server from the public_html/ directory to retrieve output from the remote server for further processing. Bias to use the wp cli tool.

//           If the user asks for something that requires many tasks, you can run multiple sql or bash commands in one script to complete the task.

//           Use wp cli or sql commands to solve the problem.

//           Always prioritize security and best practices. Never do anything or run any command which will harm the database, server, or the site.
//       `;
//       } else {
//         const imageData = imageBase64.split(",")[1];

//         const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
//         const prompt = "List the books in this image.";
//         const image = {
//           inlineData: {
//             data: imageData,
//             mimeType: "image/png",
//           },
//         };

//         const result = await model.generateContent([prompt, image]);
//         text = result.response.text();
//         console.log(text);
//       }

//       spinnerStream.done(null);
//       messageStream.done(null);

//       uiStream.done(
//         <BotCard>
//           <Video isLoading={true} />
//         </BotCard>
//       );

//       aiState.done({
//         ...aiState.get(),
//         interactions: [text],
//       });
//     } catch (e) {
//       console.error(e);

//       const error = new Error(
//         "The AI got rate limited, please try again later."
//       );
//       uiStream.error(error);
//       spinnerStream.error(error);
//       messageStream.error(error);
//       aiState.done();
//     }
//   })();

//   return {
//     id: nanoid(),
//     attachments: uiStream.value,
//     spinner: spinnerStream.value,
//     display: messageStream.value,
//   };
// }

async function submitUserMessage(content: string, plugin: Plugin) {
  "use server";
  await rateLimit();

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: `${aiState.get().interactions.join("\n\n")}\n\n${content}`,
      },
    ],
  });

  const history = aiState.get().messages.map((message: any) => ({
    role: message.role,
    content: message.content,
  }));

  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();
  (async () => {
    try {
      const result = await streamText({
        model: google("models/gemini-1.5-flash"),
        temperature: 0.5,
        tools: {},
        system: `\
        You are a friendly assistant that helps the user with solving Wordpress related issues. The user is asking questions related to:
        Plugin Name: ${plugin.name}
        Plugin Description: ${plugin.description}
    
        The date today is ${format(new Date(), "d LLLL, yyyy")}. 
          messages: [...history],
      `,
        messages: [...history],
      });

      let textContent = "";
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
          const { textDelta } = delta;

          textContent += textDelta;
          messageStream.update(<BotMessage content={textContent} />);

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: textContent,
              },
            ],
          });
        }
        // else if (type === "tool-call") {
        //   const { toolName, args } = delta;

        //   if (toolName === "listDestinations") {
        //     const { destinations } = args;

        //     uiStream.update(
        //       <BotCard>
        //         <Destinations destinations={destinations} />
        //       </BotCard>
        //     );

        //     aiState.done({
        //       ...aiState.get(),
        //       interactions: [],
        //       messages: [
        //         ...aiState.get().messages,
        //         {
        //           id: nanoid(),
        //           role: "assistant",
        //           content: `Here's a list of holiday destinations based on the books you've read. Choose one to proceed to booking a flight. \n\n ${args.destinations.join(
        //             ", "
        //           )}.`,
        //           display: {
        //             name: "listDestinations",
        //             props: {
        //               destinations,
        //             },
        //           },
        //         },
        //       ],
        //     });
        //   } else if (toolName === "showFlights") {
        //     aiState.done({
        //       ...aiState.get(),
        //       interactions: [],
        //       messages: [
        //         ...aiState.get().messages,
        //         {
        //           id: nanoid(),
        //           role: "assistant",
        //           content:
        //             "Here's a list of flights for you. Choose one and we can proceed to pick a seat.",
        //           display: {
        //             name: "showFlights",
        //             props: {
        //               summary: args,
        //             },
        //           },
        //         },
        //       ],
        //     });

        //     uiStream.update(
        //       <BotCard>
        //         <ListFlights summary={args} />
        //       </BotCard>
        //     );
        //   } else if (toolName === "showSeatPicker") {
        //     aiState.done({
        //       ...aiState.get(),
        //       interactions: [],
        //       messages: [
        //         ...aiState.get().messages,
        //         {
        //           id: nanoid(),
        //           role: "assistant",
        //           content:
        //             "Here's a list of available seats for you to choose from. Select one to proceed to payment.",
        //           display: {
        //             name: "showSeatPicker",
        //             props: {
        //               summary: args,
        //             },
        //           },
        //         },
        //       ],
        //     });

        //     uiStream.update(
        //       <BotCard>
        //         <SelectSeats summary={args} />
        //       </BotCard>
        //     );
        //   } else if (toolName === "showBoardingPass") {
        //     aiState.done({
        //       ...aiState.get(),
        //       interactions: [],
        //       messages: [
        //         ...aiState.get().messages,
        //         {
        //           id: nanoid(),
        //           role: "assistant",
        //           content:
        //             "Here's your boarding pass. Please have it ready for your flight.",
        //           display: {
        //             name: "showBoardingPass",
        //             props: {
        //               summary: args,
        //             },
        //           },
        //         },
        //       ],
        //     });

        //     uiStream.update(
        //       <BotCard>
        //         <BoardingPass summary={args} />
        //       </BotCard>
        //     );
        //   } else if (toolName === "showFlightStatus") {
        //     aiState.update({
        //       ...aiState.get(),
        //       interactions: [],
        //       messages: [
        //         ...aiState.get().messages,
        //         {
        //           id: nanoid(),
        //           role: "assistant",
        //           content: `The flight status of ${args.flightCode} is as follows:
        //         Departing: ${args.departingCity} at ${args.departingTime} from ${args.departingAirport} (${args.departingAirportCode})
        //         `,
        //         },
        //       ],
        //       display: {
        //         name: "showFlights",
        //         props: {
        //           summary: args,
        //         },
        //       },
        //     });

        //     uiStream.update(
        //       <BotCard>
        //         <FlightStatus summary={args} />
        //       </BotCard>
        //     );
        //   }
        // }
      }

      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        "The AI got rate limited, please try again later."
      );
      uiStream.error(error);
      textStream.error(error);
      messageStream.error(error);
      // aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
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
  interactions?: string[];
  messages: Message[];
  plugin: Plugin | null;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const PluginAI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    requestCode,
    validateCode,
    // describeImage,
  },
  initialUIState: [],
  initialAIState: {
    chatId: nanoid(),
    interactions: [],
    messages: [],
    plugin: null,
  },
  onGetUIState: async () => {
    "use server";

    const user = await currentUser();

    if (user) {
      const aiState = getAIState() as Chat;

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    "use server";

    const user = await currentUser();

    if (user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = user.id as string;
      const path = `/chat/${chatId}`;
      const title = messages[0].content.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path,
      };

      await saveChat(chat);
    } else {
      return;
    }
    return;
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "assistant" ? (
          <BotMessage content={message.content} />
        ) : message.role === "user" ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        ),
    }));
};