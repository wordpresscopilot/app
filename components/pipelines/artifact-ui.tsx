"use client";

import { CopyStringIcon } from "@/components/CopyStringIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useActiveArtifact } from "@/contexts/active-artifact";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Artifact, ArtifactType } from "@/types/export-pipeline";
import { XIcon } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IframePanel } from "../iframe-panel";
import { PlaygroundArtifact } from "../playground/playground-artifact";
import JSONArrayTable from "../ui/json-table";

const CODE_TYPES = [
  ArtifactType.CODE,
  ArtifactType.SQL,
  ArtifactType.PHP,
  ArtifactType.JSON,
  ArtifactType.CSV,
  ArtifactType.YAML,
  ArtifactType.XML,
  ArtifactType.JSON_TABLE,
];

const JSON_TYPES = [ArtifactType.JSON, ArtifactType.JSON_TABLE];

export function ArtifactUI() {
  const { activeArtifact, setActiveArtifact } = useActiveArtifact();
  const { isAboveLg } = useBreakpoint("lg");

  if (!isAboveLg) {
    return (
      <Sheet
        open={!!activeArtifact}
        onOpenChange={() => setActiveArtifact(null)}
      >
        <SheetContent side="bottom" className="w-full">
          <ArtifactCard
            artifact={activeArtifact}
            setActiveArtifact={setActiveArtifact}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ArtifactCard
      artifact={activeArtifact}
      setActiveArtifact={setActiveArtifact}
    />
  );
}

const ArtifactCard = ({
  artifact,
  setActiveArtifact,
}: {
  artifact: Artifact | null;
  setActiveArtifact: (artifact: Artifact | null) => void;
}) => {
  console.log("artifact", artifact);
  if (artifact?.type === ArtifactType.SITE) {
    return <IframePanel src={artifact.content[0]} />;
  } else if (artifact?.type === ArtifactType.PLAYGROUND) {
    return <PlaygroundArtifact artifact={artifact} />;
  }
  return (
    <div
      className={
        "flex p-3 justify-stretch transition-[width] flex-grow basis-full sm:h-[calc(100vh-120px)]"
      }
    >
      <div className="border rounded-lg w-full h-full overflow-hidden">
        <Card>
          <CardHeader>
            {
              artifact ? (
                <>
                  <div className="flex justify-between">
                    <CardTitle>{artifact?.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <CopyStringIcon
                        stringToCopy={artifact.content.join("\n")}
                      />
                      <XIcon
                        className="w-6 h-6 cursor-pointer transition-colors text-muted-foreground hover:text-primary-foreground hidden lg:block"
                        size={26}
                        onClick={() => setActiveArtifact(null)}
                      />
                    </div>
                  </div>
                  <CardDescription>{artifact?.description}</CardDescription>
                </>
              ) : null
              // (
              //   <CardDescription>
              //     Select an artifact to view details.
              //   </CardDescription>
              // )
            }
          </CardHeader>
          <CardContent className="h-[calc(100vh-200px)] overflow-y-scroll">
            {artifact?.isError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{artifact.content[0]}</span>
                <pre className="mt-2 text-sm">
                  {JSON.stringify(JSON.parse(artifact.content[0]), null, 2)}
                </pre>
              </div>
            )}
            {!artifact?.isError &&
              artifact?.content.map((item, index) =>
                artifact?.type === ArtifactType.JSON_TABLE ? (
                  <JSONArrayTable key={index} data={item} />
                ) : CODE_TYPES.includes(artifact?.type) ? (
                  JSON_TYPES.includes(artifact?.type) ? (
                    <SyntaxHighlighter key={index} style={dark} language="json">
                      {item}
                    </SyntaxHighlighter>
                  ) : (
                    <SyntaxHighlighter key={index} style={dark}>
                      {item}
                    </SyntaxHighlighter>
                  )
                ) : null
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
