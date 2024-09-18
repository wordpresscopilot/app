"use server";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";

export const runWPAgent = async ({
  tasks,
  aiState,
  onExecuteSSH,
  onExecuteSQL,
  onProblemSolved,
}: {
  tasks: any;
  aiState: any;
  onExecuteSSH: (
    bash_script: string
  ) => AsyncGenerator<JSX.Element, void, unknown>;
  onExecuteSQL: (query: string) => AsyncGenerator<JSX.Element, void, unknown>;
  onProblemSolved: (
    solved: boolean,
    explanation: string,
    more_steps?: boolean
  ) => AsyncGenerator<void, void, unknown>;
}) => {
  const { toolCalls } = await generateText({
    model: openai(process.env.DEFAULT_OPENAI_MODEL || "gpt-3.5-turbo", {
      structuredOutputs: true,
    }),
    tools: {
      execute_ssh: tool({
        description: "Execute an SSH command on the WordPress server.",
        parameters: z.object({
          bash_script: z.string(),
        }),
        execute: async ({ bash_script }: { bash_script: string }) => {
          await onExecuteSSH(bash_script);
        },
      }),
      execute_sql: tool({
        description: "Execute an SQL query on the WordPress database.",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async ({ query }: { query: string }) => {
          await onExecuteSQL(query);
        },
      }),
      confirm_problem_solved: tool({
        description:
          "Verify if the user's request has been addressed, the problem is solved, or if there are more steps to take.",
        parameters: z.object({
          solved: z.boolean(),
          explanation: z.string(),
          more_steps: z.boolean(),
        }),
        execute: async ({
          solved,
          explanation,
          more_steps,
        }: {
          solved: boolean;
          explanation: string;
          more_steps?: boolean;
        }) => {
          await onProblemSolved(solved, explanation, more_steps);
        },
      }),
    },
    maxToolRoundtrips: 5,
    toolChoice: "required",
    messages: [...aiState.get().messages],
    system: `
      You are an AI agent for WordPress site management and development. You have access to run sql and ssh accessible wordpress tools.
      Analyze the tasks needed to implement and determine what actions are required to solve the user's problem.
      Use the appropriate tools to execute commands and queries.
      Verify if the problem is solved after each action or run another action if necessary.
      Provide clear explanations and results to the user.

      **Tasks:**
      ${tasks}
    `,
    onStepFinish: ({ text, toolCalls, toolResults }) => {
      console.log("onStepFinish", {
        text,
        toolCalls,
        toolResults,
      });
      console.log("toolCalls", toolCalls?.[0]?.args);
      console.log("toolResults?.[0]?.args", toolResults?.[0]?.args);
      console.log("toolResults?.[0]?.args", toolResults?.[0]?.args);
      // aiState.update((state) => {
      //   state.messages.push({ role: "system", content: step });
      // });
    },
  });

  return toolCalls;
};
