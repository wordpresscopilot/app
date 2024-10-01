"use client";
import { useActiveArtifact } from "@/contexts/active-artifact";
import { ArtifactsView } from "../ui/assistant-ui/artifacts-view";
import { MyThread } from "../ui/assistant-ui/thread";

export function AssistantUI() {
  const { activeArtifact } = useActiveArtifact();
  return (
    <div
      className={`w-full h-full ${
        activeArtifact ? "md:grid md:grid-cols-2" : "grid-cols-1"
      } grid-rows-1`}
    >
      <div className={`${activeArtifact ? "md:col-span-1" : "h-full w-full"}`}>
        <MyThread />
      </div>
      {activeArtifact && (
        <div className="md:col-span-1">
          <ArtifactsView />
        </div>
      )}
    </div>
  );
}
