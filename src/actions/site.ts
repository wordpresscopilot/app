'use server';

import { WP_SAGE_RUN_SQL } from "@/lib/paths";
import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/utils";
import { SftpCredentials, WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { Unkey } from "@unkey/api";
import { kv } from "@vercel/kv";
import { executeWordPressSQL } from "./wp";


const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });


export async function currentSite(pathname: string) {
  const user = await currentUser();
  
  if (!user) throw new Error('User not found');

  return await prisma.wp_site.findFirst({
    where: {
      user_id: user.id,
    },
  });
}
export async function createSiteProject(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error('User not found');

  const name = formData.get('name') as string;
  const baseUrl = formData.get('baseUrl') as string;
  const new_site_id = nanoid();

  const created_key = await unkey.keys.create({
    apiId: process.env.UNKEY_API_ID!,
    prefix:"sage",
    byteLength:16,
    externalId: user.id,
    meta:{
      site_id: new_site_id,
    },
    enabled: true
  })
  const newSite = await prisma.wp_site.create({
    data: {
      id: new_site_id,
      user_id: user.id,
      name,
      base_url: baseUrl,
      api_key: created_key?.result?.key!
    },
  });

  // Update Redis cache
  const cacheKey = `sites:${user.id}`;
  const cachedSites = await kv.hgetall(cacheKey);

  if (cachedSites && cachedSites.sites) {
    const updatedSites = [...(cachedSites.sites as WpSite[]), newSite];
    await kv.hmset(cacheKey, { sites: updatedSites });
  } else {
    await kv.hmset(cacheKey, { sites: [newSite] });
  }

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
    sftp_credentials?: SftpCredentials
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
    select: { user_id: true }
  });

  if (!site) {
    throw new Error('Site not found');
  }

  await prisma.wp_site.delete({
    where: { id },
  });

  // Update cache
  const cacheKey = `sites:${site.user_id}`;
  const cachedSites = await kv.hgetall(cacheKey);

  if (cachedSites && cachedSites.sites) {
    const updatedSites = (cachedSites.sites as WpSite[]).filter(s => s.id !== id);
    await kv.hmset(cacheKey, { sites: updatedSites });
  }

  return true;
}

export async function retrieveSites({
  user_id,
}: {
  user_id: string;
}): Promise<WpSite[]> {
  const cacheKey = `sites:${user_id}`;
  const cachedSites = await kv.hgetall(cacheKey);

  if (cachedSites && cachedSites.sites) {
    return cachedSites.sites as WpSite[];
  }

  const sites = await prisma.wp_site.findMany({
    where: {
      user_id,
    },
  }) as WpSite[];

  await kv.hmset(cacheKey, { sites });
  return sites;
}

export async function runSiteHealthCheck(id: string, url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'WordPress Sage Health Check',
      },
    });
    await prisma.wp_site.update({
      where: {
        id,
      },
      data: {
        connected: response.ok,
        ...(response.ok && { last_connected_date: new Date() }),
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
  }
  return false;
}

export async function runSFTPHealthCheck(credentials: SftpCredentials) {

}

export async function getCoreSiteData(siteId: string) {
  const cacheKey = `core_site_data:${siteId}`;
  const cachedData = await kv.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const site = await prisma.wp_site.findUnique({
    where: {
      id: siteId,
    },
  });
  if (!site) {
    return;
  }

  if(!site?.connected) {
    return;
  }

  const query = `
    SELECT option_name, option_value
    FROM wp_options
    WHERE option_name IN ('siteurl', 'home', 'blogname', 'blogdescription')
  `;
  let endpoint_url;
  try {
    endpoint_url = new URL(WP_SAGE_RUN_SQL, site.base_url).toString();
  } catch (error) {
    return;
  }
  
  let result = await executeWordPressSQL({
    query,
    api_key: site?.api_key,
    api_url: endpoint_url
  });

  const parsedResult = JSON.parse(result) as { option_name: string; option_value: string }[];

  const core_site_data = parsedResult.reduce((acc: Record<string, string>, { option_name, option_value }) => {
      acc[option_name] = option_value;
      return acc;
  }, {});

  if(core_site_data?.blogname && core_site_data?.blogname !== site?.name) {
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
  await kv.set(cacheKey, core_site_data, { ex: 43200 });
  // Invalidate the user's sites cache
  await kv.del(`sites:${site.user_id}`);
  return core_site_data;
}
