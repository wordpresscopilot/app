import { makeAssistantToolUI } from "@assistant-ui/react";

type WebSearchArgs = {
  query: string;
};

type WebSearchResult = {
  title: string;
  description: string;
  url: string;
};

export const WebSearchToolUI = makeAssistantToolUI<
  WebSearchArgs,
  WebSearchResult
>({
  toolName: "web_search",
  render: ({ part, status }) => {
    return <p>web_search({part.args.query})</p>;
  },
});

export const useWebSearchToolUI = makeAssistantToolUI<
  WebSearchArgs,
  WebSearchResult
>({
  toolName: "web_search",
  render: ({ part, status }) => {
    return <p>web_search({part.args.query})</p>;
  },
});
