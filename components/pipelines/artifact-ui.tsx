"use client";

import { useExportContext } from "@/components/pipelines/provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ArtifactUI() {
  const { activeArtifact } = useExportContext();

  return (
    <Card>
      <CardHeader>
        {activeArtifact ? (
          <>
            <CardTitle>{activeArtifact?.name}</CardTitle>
            <CardDescription>{activeArtifact?.description}</CardDescription>
          </>
        ) : (
          <CardDescription>Select an artifact to view details.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {activeArtifact?.content.map((content, index) => (
          <div key={index}>{content}</div>
        ))}
      </CardContent>
    </Card>
  );
}
