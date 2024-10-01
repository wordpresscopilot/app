import { makePrismAsyncLightSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter";
import { PrismAsyncLight } from "react-syntax-highlighter";

import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import html from "react-syntax-highlighter/dist/esm/languages/prism/xml-doc";

import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

// register languages you want to support
PrismAsyncLight.registerLanguage("html", html);
PrismAsyncLight.registerLanguage("js", tsx);
PrismAsyncLight.registerLanguage("jsx", tsx);
PrismAsyncLight.registerLanguage("ts", tsx);
PrismAsyncLight.registerLanguage("tsx", tsx);
PrismAsyncLight.registerLanguage("python", python);

export const SyntaxHighlighter = makePrismAsyncLightSyntaxHighlighter({
  style: coldarkDark,
  customStyle: {
    margin: 0,
    width: "100%",
    background: "#000",
    padding: "1.5rem 1rem",
  },
});

export const MarkdownText = makeMarkdownText({
  components: { SyntaxHighlighter },
});
