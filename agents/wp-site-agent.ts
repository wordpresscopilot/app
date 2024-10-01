"use server";
import { executeWordPressSQLWithSiteID, getCurrentSiteInfo, getCurrentSitePlugins } from '@/actions/wp';
import { installPlugin } from '@/data/site';
import { searchWordPressPlugins } from '@/lib/wordpress';
import { WpSite } from '@/types';
import { Artifact, Message, ToolType } from '@/types/export-pipeline';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, CoreMessage, generateText, tool } from 'ai';
import { z } from 'zod';

export const runWPSiteAgent = async ({site, messages}: {site: WpSite, messages: Message[]}) => {
    // ensure that the content is not too long for the LLM
    const core_messages = convertToCoreMessages(messages.map((message: Message, index: number) => {
        if (index === messages.length - 1) {
            return {
                role: message.role,
                content: [
                    { 
                        type: "text", 
                        text: message.text?.[0]?.text + ((message.artifacts?.length ?? 0) > 0 ? "\nArtifacts: " + JSON.stringify(message.artifacts) : "")
                    },
                ].filter(Boolean) as any,
                name: message.id,
            };
        }

        const artifacts = message.artifacts?.map((artifact: Artifact) => {
            const stringifedContent = JSON.stringify(artifact?.content)?.substring(0, 500);
            return {
                ...artifact,
                content: stringifedContent,
            }
        });
        const stringifedText = message.text?.[0]?.text?.substring(0, 500);
        return ({
            role: message.role,
            content: [
                { 
                    type: "text", 
                    text: stringifedText + ((artifacts?.length ?? 0) > 0 ? "\nArtifacts: " + JSON.stringify(artifacts) : "")
                },
            ].filter(Boolean) as any,
            name: message.id,
        });
    })) as CoreMessage[];
    console.log("submitting core messages", core_messages);
    const result = await generateText({
        model: openai(process.env.DEFAULT_OPENAI_MODEL || 'gpt-4o-mini', { structuredOutputs: true }),
        tools: {
            [ToolType.GET_CURRENT_SITE_PLUGINS]: tool({
                description: `Get the site's current site plugins.`,
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description which will be shown to the user about why this tool is being called.'),
                }),
                execute: async () => {
                    return await getCurrentSitePlugins({site_id: site.id});
                },
            }),
            [ToolType.GET_CORE_SITE_DATA]: tool({
                description: 'Get core data from the WordPress site including site title, site tagline, theme, wordpress version, site url, language, timezone, dateformat',
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description which will be shown to the user about why this tool is being called.'),
                }),
                execute: async () => {
                    return await getCurrentSiteInfo({site_id: site.id});
                },
            }),
            [ToolType.RUN_SQL_QUERY]: tool({
                description: 'Run an SQL query on the WordPress site.',
                parameters: z.object({
                    query: z.string(),
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description which will be shown to the user about why this tool is being called.'),
                }),
                execute: async ({ query, description }) => {
                    return await executeWordPressSQLWithSiteID({site_id: site.id, query});
                },
            }),
            // runWPCLI: tool({
            //     description: 'Run a WP CLI command on the WordPress site.',
            //     parameters: z.object({
            //         bash_command: z.string(),
            //     }),
            //     execute: async ({ command }) => {
            //         return await runWPCLI({site_id: site.id, command});
            //     },
            // }),

            [ToolType.SEARCH_PLUGINS]: tool({
                description: 'Run a query to search for plugins on the official WordPress plugin repository at api.wordpress.org',
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description which will be shown to the user about why this tool is being called.'),
                    query: z.string(),
                    page: z.number(),
                    perPage: z.number()
                }),
                execute: async ({ query, page, perPage }) => {
                    return await searchWordPressPlugins(query, page, perPage);
                },
            }),
            [ToolType.INSTALL_PLUGIN]: tool({
                description: 'Install a WordPress plugin on a user\'s site.',
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description to be shown to the user about why this tool is being called.'),
                    plugin: z.object({
                        name: z.string(),
                        slug: z.string(),
                        version: z.string(),
                        author: z.string(),
                        rating: z.number(),
                        download_link: z.string(),
                    }),
                }),
                execute: async ({ plugin }) => {
                    console.log('installPlugin plugin', plugin);
                    const installPluginResult = await installPlugin(site.id, plugin.download_link);
                    console.log('installPluginResult', installPluginResult);
                    return installPluginResult;
                },
            }), 
            [ToolType.ASK_FOR_PERMISSION]: tool({
                description: 'Ask the user for permission to perform write or update actions on the site.',
                parameters: z.object({
                    title: z.string().describe('The action title that requires permission'),
                    description: z.string().describe('Additional details about the action'),
                }),
            }),
            [ToolType.ANSWER]: tool({
                description: `A tool for providing the final answer about the user's inquiry regarding their wordpress site`,
                parameters: z.object({
                    steps: z.array(
                        z.object({
                            calculation: z.string(),
                            reasoning: z.string(),
                        }),
                    ),
                    answer: z.string(),
                }),
            }),
            [ToolType.ERROR]: tool({
                description: 'A tool for indicating that the task was not successful.',
                parameters: z.object({
                    title: z.string().describe('The title of the error artifact which shows the results to the user.'),
                    description: z.string().describe('A detailed description of the error that occurred.'),
                }),
            }),
        },
        maxSteps: 10,
        toolChoice: 'required',
        system: `
        You are an AI assistant for WordPress site management and development. You help the user automate tasks related to developing and managing their WordPress site.
        
        You have the ability to both read and write to a wordpress site via a plugin installed on the site, ssh access, sftp access, and access to run queries against the sql database.

        All tools are available to you and you can use them freely. Prioritize using the tools to solve the problem, also use your knowledge base to help the user.

        You can read anything without user permission. But you must have the user's permission to write or change something on the site. You can ask for permission to perform an action using the askForPermission tool.
    
        1. Execute SQL queries on the WordPress database to assist users via runSQLQuery tool.
        2. Search for WordPress plugins via searchPlugins tool.
        3. Download and install WordPress plugins via the installPlugin tool.
        4. Provide helpful information about plugins and guide the user through the process.
        5. If the user asks for something that requires many tasks, you can run multiple sql or bash commands in one script to complete the task.
        `,
        //       5. Use the WP CLI to perform site management tasks via wp tool, only if the tool is available to you.

        messages: core_messages,
        onStepFinish: (step) => {
            // sendUpdate({ type: 'step', data: step });
            console.log('step', step);
        },
    });
    console.log("result", result);
    // console.log(`FINAL TOOL CALLS: ${JSON.stringify(toolCalls, null, 2)}`);
    // console.log("STEPS: " + JSON.stringify(result.steps, null, 2));


    // Group tool-call and tool-result by toolCallId
    const groupedMessages = result.responseMessages.reduce((acc, message) => {
        if (message.role === 'assistant') {
            (message.content as any[]).forEach((content: any) => {
                if (content.type === 'tool-call') {
                    const toolCallId = content.toolCallId;
                    if (!acc[toolCallId]) {
                        acc[toolCallId] = { ...content };
                    }
                }
            });
        } else if (message.role === 'tool') {
            message.content.forEach((content: any) => {
                if (content.type === 'tool-result') {
                    const toolCallId = content.toolCallId;
                    if (acc[toolCallId]) {
                        acc[toolCallId].result = content.result;
                    }
                }
            });
        }
        return acc;
    }, {} as Record<string, any>);

    // Combine tool-call with tool-result within the assistant message
    const combinedMessages = result.responseMessages.map(message => {
        if (message.role === 'assistant') {
            const newContent = (message.content as any[]).reduce((acc: any[], content: any) => {
                if (content.type === 'text' && content.text !== '') {
                    acc.push(content);
                } else if (content.type === 'tool-call') {
                    const combinedTool = groupedMessages[content.toolCallId];
                    acc.push({
                        type: 'tool-call',
                        toolName: combinedTool.toolName,
                        args: combinedTool.args,
                        result: combinedTool.result
                    });
                }
                return acc;
            }, []);
            return { ...message, content: newContent };
        }
        return message;
    }).filter(message => message.role !== 'tool');

    console.log('combinedMessages', JSON.stringify(combinedMessages, null, 2));

    return {steps: result.steps, toolCalls: result.toolCalls, responseMessages: result.responseMessages, combinedMessages};
}