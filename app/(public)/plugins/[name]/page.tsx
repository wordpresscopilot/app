import { PluginAI } from "@/actions/plugin-ai";
import BrandCard from "@/components/plugins/brand-card";
import { PluginChat } from "@/components/plugins/chat";
import { plugins } from "@/constants/plugins";
import { mapClerkUserForClient } from "@/lib/utils";
import { Plugin } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
export default async function PluginPage({
  params,
}: {
  params: { name: string };
}) {
  const user = await currentUser();
  const decodedName = decodeURIComponent(params.name);
  const plugin = plugins.find(
    (plugin) => plugin.name.toLowerCase() === decodedName.toLowerCase()
  ) as Plugin;

  if (!plugin) {
    return <div>Plugin not found</div>;
  }

  const id = nanoid();

  return (
    <div>
      <BrandCard plugin={plugin} />
      <PluginAI
        initialAIState={{ chatId: id, interactions: [], messages: [], plugin }}
      >
        <PluginChat
          id={id}
          user={mapClerkUserForClient(user!)}
          initialMessages={[]}
          missingKeys={[]}
          plugin={plugin}
        />
      </PluginAI>
    </div>
  );
}
