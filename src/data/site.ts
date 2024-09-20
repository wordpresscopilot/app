"use server";

import { executeWordPressSQL } from "@/actions/wp";
import { WP_PATH_RUN_SQL } from "@/lib/paths";
import { prisma } from "@/lib/prisma";
import { SSH, WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export async function currentSite(id: string) {
  const user = await currentUser();

  if (!user) throw new Error("User not found");

  return await prisma.wp_site.findFirst({
    where: {
      id,
    },
  });
}

export async function retrieveSites({
  user_id,
}: {
  user_id: string;
}): Promise<WpSite[]> {
  // const cacheKey = `sites:${user_id}`;
  // const cachedSites = await kv.hgetall(cacheKey);

  // if (cachedSites && cachedSites.sites) {
  //   return cachedSites.sites as WpSite[];
  // }

  const sites = (await prisma.wp_site.findMany({
    where: {
      user_id,
    },
  })) as WpSite[];

  // await kv.hmset(cacheKey, { sites });
  return sites;
}

export async function runSiteHealthCheck(
  id: string,
  url: string
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "WordPress Sage Health Check",
      },
    });
    await prisma.wp_site.update({
      where: {
        id,
      },
      data: {
        plugin_connected: response.ok,
        ...(response.ok && { last_connected_date: new Date() }),
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
  }
  return false;
}

export async function runSSHHealthCheck(credentials: SSH) {}

export async function getCoreSiteData(siteId: string) {
  // const cacheKey = `core_site_data:${siteId}`;
  // const cachedData = await kv.get(cacheKey);

  // if (cachedData) {
  //   return cachedData;
  // }

  const site = await prisma.wp_site.findUnique({
    where: {
      id: siteId,
    },
  });
  if (!site) {
    return;
  }

  if (!site?.plugin_connected) {
    return;
  }

  const query = `
    SELECT option_name, option_value
    FROM wp_options
    WHERE option_name IN ('siteurl', 'home', 'blogname', 'blogdescription')
  `;
  let endpoint_url;
  try {
    endpoint_url = new URL(WP_PATH_RUN_SQL, site.base_url).toString();
  } catch (error) {
    return;
  }

  let { status, ok, data } = await executeWordPressSQL({
    query,
    api_key: site?.api_key,
    api_url: endpoint_url,
  });
  if (!ok) {
    return {};
  }
  const parsedResult = data as { option_name: string; option_value: string }[];

  const core_site_data = parsedResult.reduce(
    (acc: Record<string, string>, { option_name, option_value }) => {
      acc[option_name] = option_value;
      return acc;
    },
    {}
  );

  if (core_site_data?.blogname && core_site_data?.blogname !== site?.name) {
    await prisma.wp_site.update({
      where: {
        id: siteId,
      },
      data: {
        name: core_site_data.blogname,
      },
    });
  }
  // Cache the result for 1 hour
  // await kv.set(cacheKey, core_site_data, { ex: 43200 });
  // Invalidate the user's sites cache
  // await kv.del(`sites:${site.user_id}`);
  return core_site_data;
}
