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
import { ArtifactType } from "@/types/export-pipeline";

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
  const { activeArtifact } = useExportContext();

  return (
    <Card>
      <CardHeader>
        {activeArtifact ? (
          <>
            <div className="flex justify-between">
              <CardTitle>{activeArtifact?.title}</CardTitle>
              <CopyStringIcon
                stringToCopy={activeArtifact?.content.join("\n")}
              />
            </div>
            <CardDescription>{activeArtifact?.description}</CardDescription>
          </>
        ) : (
          <CardDescription>Select an artifact to view details.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {activeArtifact?.content.map((content, index) =>
          CODE_TYPES.includes(activeArtifact?.type) ? (
            <pre key={index} className="p-4 rounded overflow-auto">
              <code>
                {JSON_TYPES.includes(activeArtifact?.type)
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
}
