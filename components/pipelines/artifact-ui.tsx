"use client";

import { CopyStringIcon } from "@/components/CopyStringIcon";
import { useExportContext } from "@/components/pipelines/provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Artifact, ArtifactType } from "@/types/export-pipeline";

const CODE_TYPES = [
  ArtifactType.CODE,
  ArtifactType.SQL,
  ArtifactType.JSON,
  ArtifactType.CSV,
  ArtifactType.YAML,
  ArtifactType.XML,
  ArtifactType.JSON_TABLE,
];

const JSON_TYPES = [ArtifactType.JSON, ArtifactType.JSON_TABLE];

export function ArtifactUI() {
  const { activeArtifact, setActiveArtifact } = useExportContext();
  const { isAboveLg } = useBreakpoint("lg");

  if (!isAboveLg) {
    return (
      <Sheet
        open={!!activeArtifact}
        onOpenChange={() => setActiveArtifact(null)}
      >
        <SheetContent side="bottom" className="w-full">
          <ArtifactCard artifact={activeArtifact} />
        </SheetContent>
      </Sheet>
    );
  }

  return <ArtifactCard artifact={activeArtifact} />;
}

const ArtifactCard = ({ artifact }: { artifact: Artifact | null }) => {
  return (
    <Card>
      <CardHeader>
        {artifact ? (
          <>
            <div className="flex justify-between">
              <CardTitle>{artifact?.title}</CardTitle>
              <CopyStringIcon stringToCopy={artifact?.content.join("\n")} />
            </div>
            <CardDescription>{artifact?.description}</CardDescription>
          </>
        ) : (
          <CardDescription>Select an artifact to view details.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {artifact?.content.map((content, index) =>
          CODE_TYPES.includes(artifact?.type) ? (
            <pre key={index} className="p-4 rounded overflow-auto">
              <code>
                {JSON_TYPES.includes(artifact?.type)
                  ? JSON.stringify(content, null, 2)
                  : content}
              </code>
            </pre>
          ) : (
            <div key={index}>{content}</div>
          )
        )}
      </CardContent>
    </Card>
  );
};
