"use server";

import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/utils";
import { SSH, WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { Unkey } from "@unkey/api";

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

export async function createSiteProject(formData: FormData): Promise<WpSite> {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const name = formData.get("name") as string;
  const baseUrl = formData.get("baseUrl") as string;
  const new_site_id = nanoid();

  const created_key = await unkey.keys.create({
    apiId: process.env.UNKEY_API_ID!,
    prefix: "wpc",
    byteLength: 16,
    externalId: user.id,
    meta: {
      site_id: new_site_id,
    },
    enabled: true,
  });
  const newSite = (await prisma.wp_site.create({
    data: {
      id: new_site_id,
      user_id: user.id,
      name,
      base_url: baseUrl,
      api_key: created_key?.result?.key!,
      plugin_connected: false,
    },
  })) as WpSite;

  // Update Redis cache
  // const cacheKey = `sites:${user.id}`;
  // const cachedSites = await kv.hgetall(cacheKey);

  // if (cachedSites && cachedSites.sites) {
  //   const updatedSites = [...(cachedSites.sites as WpSite[]), newSite];
  //   await kv.hmset(cacheKey, { sites: updatedSites });
  // } else {
  //   await kv.hmset(cacheKey, { sites: [newSite] });
  // }

  return newSite;
}

export async function updateSite({
  id,
  fields,
}: {
  id: string;
  fields: {
    name: string;
    base_url: string;
  };
}) {
  return await prisma.wp_site.update({
    where: {
      id,
    },
    data: {
      ...fields,
    },
  });
}

export async function updateSiteSSH({
  id,
  fields,
}: {
  id: string;
  fields: {
    ssh: SSH;
  };
}) {
  return await prisma.wp_site.update({
    where: {
      id,
    },
    data: {
      ...fields,
    },
  });
}

export async function deleteSite(id: string) {
  const site = await prisma.wp_site.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!site) {
    throw new Error("Site not found");
  }

  await prisma.wp_site.delete({
    where: { id },
  });

  // Update cache
  // const cacheKey = `sites:${site.user_id}`;
  // const cachedSites = await kv.hgetall(cacheKey);

  // if (cachedSites && cachedSites.sites) {
  //   const updatedSites = (cachedSites.sites as WpSite[]).filter(
  //     (s) => s.id !== id
  //   );
  //   await kv.hmset(cacheKey, { sites: updatedSites });
  // }

  return true;
}
