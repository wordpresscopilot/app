"use server";
import { executeWordPressSQLWithSiteID, getCurrentSiteInfo, getCurrentSitePlugins } from '@/actions/wp';
import { installPlugin, installPluginFile, removePlugin } from '@/data/site';
import { searchWordPressPlugins } from '@/lib/wordpress';
import { WpSite } from '@/types';
import { Artifact, Message, ToolType } from '@/types/export-pipeline';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { convertToCoreMessages, CoreMessage, generateObject, generateText, tool } from 'ai';
import { z } from 'zod';

const openpipeOpenai = createOpenAI({
  apiKey: process.env.OPENPIPE_API_KEY ?? "",
  baseURL: "https://api.openpipe.ai/api/v1",
});

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
                description: 'Install an official WordPress plugin on a user\'s site.',
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
            [ToolType.INSTALL_PLUGIN_FILE]: tool({
                description: 'Install a WordPress plugin on a user\'s site from a string file.',
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description to be shown to the user about why this tool is being called.'),
                    pluginCode: z.string().describe('The code file of the plugin to be installed.'),
                    pluginName: z.string().describe('The name of the plugin to be installed, this is used to name the plugin file and folder.'),
                    sitePagePath: z.string().describe('The site path of the page created by the plugin.'),
                }),
                execute: async ({ pluginCode, pluginName }) => {
                    console.log("INSTALL_PLUGIN_FILE pluginCode", pluginCode);
                    console.log("INSTALL_PLUGIN_FILE pluginName", pluginName);
                    const installPluginFileResult = await installPluginFile(site.id, pluginCode, pluginName);
                    return installPluginFileResult;
                },
            }),
            [ToolType.REMOVE_PLUGIN]: tool({
                description: 'Remove a WordPress plugin on a user\'s site.',
                parameters: z.object({
                    title: z.string().describe('The title of the artifact which shows the results to the user.'),
                    description: z.string().describe('A description to be shown to the user about why this tool is being called.'),
                    plugin: z.object({
                        name: z.string(),
                        slug: z.string(),
                        version: z.string(),
                        author: z.string(),
                    }),
                }),
                execute: async ({ plugin }) => {
                    console.log("REMOVE_PLUGIN plugin", plugin);
                    const removePluginResult = await removePlugin(site.id, plugin.slug);
                    return removePluginResult;
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
                    title: z.string().describe('The title of the answer artifact which shows the steps and answer to the user.'),
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
            [ToolType.GENERATE_PAGE]: tool({
                description: 'Generate a plugin which creates a page with unique functionality on the WordPress site.',
                parameters: z.object({
                    title: z.string().describe('The title of the page to be generated.'),
                    description: z.string().describe('A description of the page to be generated.'),
                    
                    prompt: z.string().describe('Details, functionality, and user requirements in a prompt to be passed to another agent to generate the plugin. The other agent knows to create the plugin page but does not know what is needed by the user.'),
                }),
                execute: async ({ prompt }) => {
                    return await generatePluginPage(prompt);
                },
            }),
            [ToolType.SHOW_SITE]: tool({
                description: 'Show the user the current state of the WordPress site.',
                parameters: z.object({
                    title: z.string().describe('The title of the site path to be shown.'),
                    description: z.string().describe('A description of the context in which the site is to be shown.'),
                    path: z.string().describe('The path of the site to be shown.'),
                }),
            }),
        },
        // maxSteps: 10,
        toolChoice: 'required',
        system: `
        You are an AI assistant for WordPress site management and development. You help the user automate tasks related to developing and managing their WordPress site.
        
        You have the ability to both read and write to a wordpress site via a plugin installed on the site, ssh access, sftp access, and access to run queries against the sql database.

        All tools are available to you and you can use them freely. Prioritize using the tools to solve the problem, also use your knowledge base to help the user.

        You can read anything without user permission. But you must have the user's permission to change anything on the sql database or use the WP CLI Tool. You can ask for permission to perform an action using the askForPermission tool.

        Don't install plugins unless the user specifically requests it. If the user asks to generate a page, use the generatePage tool and don't assume to install plugins.
    
        1. Execute SQL queries on the WordPress database to assist users via runSQLQuery tool.
        2. Search for WordPress plugins via searchPlugins tool.
        3. Download and install WordPress plugins via the installPlugin tool.
        4. Provide helpful information about plugins and guide the user through the process.
        5. If the user asks for something that requires many tasks, you can run multiple sql or bash commands in one script to complete the task.
        6. Generate a WordPress plugin to perform page or post related tasks via the generatePage tool.
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

export const generatePluginPage = async (prompt: string) => {
    const result = await generateObject({
        model: openai(process.env.DEFAULT_OPENAI_MODEL || 'gpt-4o-mini'),
        system: `
            Create a single page self-contained WordPress plugin to generate a custom page using the Gutenberg WordPress block editor. The plugin should:
                - Allow the page to be edited via /wp-admin/edit.php?post_type=page
                - Make the page accessible to public users at the route /ai-plugin-demo
                - Be easy to install and activate via the WordPress Plugin interface
                - Show links to edit and view the custom page in the plugin settings
                - Contain a single php file, nothing else.
                
            Ensure to include:
            1. **Plugin Header Setup**: Define the plugin header with metadata.
            2. **Custom Page Creation**: Register a custom route /ai-plugin-demo.
            3. **Gutenberg Integration**: Ensure Gutenberg is enabled for the custom page/post type.
            4. **Active Hooks**: Use WordPress hooks to initialize and display the page.
            5. **Installation Ready**: Package the plugin in a way that it can be easily installed via the WordPress Plugin interface.
            
            For images, use placehold.co urls with custom dimensions fitting the use case. Example: https://placehold.co/600x400
            Customize the plugin based on the user's prompt.`,
        schema: z.object({
            plugin_name: z.string().describe('The file name of the plugin to be generated. This will be the name of the plugin folder and the file.'),
            plugin_file_content: z.string().describe('The single page php file content to be generated.'),
            page_path: z.string().describe('The path of the page to be generated. This should start with a / and be relative to the root of the WordPress site.'),
        }),
        prompt,
        output: 'array',
    });
    return result?.object?.[0];
}