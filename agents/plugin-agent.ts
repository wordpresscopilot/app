// @ts-nocheck

import { downloadPlugin, searchWordPressPlugins } from '@/lib/wordpress';
import { Message } from '@/types/export-pipeline';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, CoreMessage, generateText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';

export const runPluginAgent = async ({messages}: {messages: Message[]}) => {
    const core_messages = convertToCoreMessages(messages.map((message: Message) => ({
        role: message.role,
        content: [
      { 
        type: "text", 
        text: message.text?.[0]?.text + ((message?.artifacts?.length ?? 0) > 0 ? "\nArtifacts: " + JSON.stringify(message.artifacts) : "")
      }]
    })).filter(Boolean)) as CoreMessage[];

    const result = await generateText({
        model: openai(process.env.DEFAULT_OPENAI_MODEL || 'gpt-4o-mini', { structuredOutputs: true }),
        tools: {
            searchPlugins: tool({
                description: 'Search for WordPress plugins',
                parameters: z.object({
                    query: z.string(),
                    page: z.number().optional(),
                    perPage: z.number().optional(),
                }),
                execute: async ({ query, page = 1, perPage = 10 }) => {
                    return await searchWordPressPlugins(query, page, perPage);
                },
            }),
            downloadPlugin: tool({
                description: 'Download a WordPress plugin',
                parameters: z.object({
                    plugin: z.object({
                        name: z.string(),
                        slug: z.string(),
                        version: z.string(),
                        author: z.string(),
                        rating: z.number(),
                        download_link: z.string().optional(),
                    }),
                }),
                execute: async ({ plugin }) => {
                    const pluginBuffer = await downloadPlugin(plugin as Plugin);
                    const installPlugin = await installPlugin(pluginBuffer);
                    return `Plugin ${plugin.name} downloaded successfully. Buffer size: ${pluginBuffer.length} bytes`;
                },
            }),
            answer: tool({
                description: 'A tool for providing the final answer.',
                parameters: z.object({
                    searchResults: z.array(z.object({
                        name: z.string(),
                        slug: z.string(),
                        version: z.string(),
                        author: z.string(),
                        rating: z.number(),
                    })).optional(),
                    downloadedPlugin: z.string().optional(),
                    explanation: z.string(),
                }),
                execute: async ({}) => {
                    return 'Final answer';
                },
            }),
            success: tool({
                description: 'A tool for indicating that the task was successful.',
                parameters: z.object({
                    message: z.string(),
                }),
                execute: async ({ message }) => {
                    return message;
                },
            }),
            error: tool({
                description: 'A tool for indicating that the task was not successful.',
                parameters: z.object({
                    message: z.string(),
                }),
                execute: async ({ message }) => {
                    return message;
                },
            }),
        },
        maxSteps: 5,
        system:
            'You are an AI assistant for WordPress plugin management. ' +
            'You can search for plugins and download them. ' +
            'Use the searchPlugins tool to find plugins based on user queries. ' +
            'Use the downloadPlugin tool to download a specific plugin. ' +
            'Provide helpful information about the plugins and guide the user through the process.',
        messages: core_messages,
    });

    return result;
}
