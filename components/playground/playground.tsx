"use client";

import { PlaygroundClient, startPlaygroundWeb } from "@wp-playground/client";
import React, { useEffect, useRef } from "react";

interface PlaygroundComponentProps {
  blueprint?: any; // You can define a more specific type for blueprint if needed
}

export const PlaygroundComponent: React.FC<PlaygroundComponentProps> = ({
  blueprint,
}) => {
  console.log("blueprint", blueprint);
  const clientRef = useRef<PlaygroundClient | null>(null);

  useEffect(() => {
    const initPlayground = async () => {
      const client = await startPlaygroundWeb({
        iframe: document.getElementById("wp-playground") as HTMLIFrameElement,
        remoteUrl: "https://playground.wordpress.net/remote.html",
        blueprint,
      });

      // Wait until Playground is fully loaded
      // await client.isReady();

      // if (blueprint) {
      //   console.log("blueprint", blueprint);
      //   await client.run(blueprint);
      // }
      // await login(client, {
      //   username: "admin",
      //   password: "password",
      // });

      clientRef.current = client;
    };

    initPlayground();

    return () => {
      if (clientRef.current) {
        // Note: There's no disconnect method in the new API
        // If cleanup is needed, you might need to handle it differently
      }
    };
  }, [blueprint]);

  return (
    <iframe
      id="wp-playground"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};
