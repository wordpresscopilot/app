"use server";

import { executeWordPressSQL } from "@/actions/wp";
import { WP_PATH_ADMIN_AUTO_LOGIN, WP_PATH_FLUSH_CACHE, WP_PATH_HEALTH, WP_PATH_INSTALL_PLUGIN, WP_PATH_INSTALL_PLUGIN_FILE, WP_PATH_REMOVE_PLUGIN, WP_PATH_SITE_INFO } from "@/lib/paths";
import { prisma } from "@/lib/prisma";
import { SSH, WpSite } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export async function currentSite(id: string) {
  console.log("currentSite", id);
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
      user_id: user_id,
    },
  })) as WpSite[];

  // await kv.hmset(cacheKey, { sites });
  return sites;
}

export async function runSiteHealthCheck(
  site_id: string,
): Promise<any> {
  try {
    const site = await currentSite(site_id);
    const url = new URL(`${site?.base_url}${WP_PATH_HEALTH}`);
    console.log({
      url: url.toString(),
      api_key: site?.api_key,
    })
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "WPCopilot Health Check",
        Authorization: `Bearer ${site?.api_key}`,
      },
    });
    const data = await response.json();
    console.log({ data });
    await prisma.wp_site.update({
      where: {
        id: site_id,
      },
      data: {
        plugin_connected: data.api_key_valid,
        ...(response.ok && { last_connected_date: new Date() }),
      },
    });

    return data;
  } catch (error) {
    console.error("Health check failed:", error);
  }
  return false;
}

export async function runSSHHealthCheck(credentials: SSH) {}

export async function getCoreSiteData(site: WpSite) {
  // const cacheKey = `core_site_data:${siteId}`;
  // const cachedData = await kv.get(cacheKey);

  // if (cachedData) {
  //   return cachedData;
  // }
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
    endpoint_url = new URL(WP_PATH_SITE_INFO, site.base_url).toString();
  } catch (error) {
    return;
  }

  const response = await fetch(endpoint_url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${site.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch from ${endpoint_url}. Status: ${response.status}`);
    return {};
  }

  const responseData = await response.json();
  console.log("responseData", responseData);
  

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
        id: site.id,
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

export async function getSshCredentials(siteId: string): Promise<SSH | null> {
  const site = await prisma.wp_site.findUnique({
    where: {
      id: siteId,
    },
  });

  return (site?.ssh as SSH) || null;
}

export async function installPlugin(siteId: string, plugin_url: string) {
  const site = await currentSite(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  
  const endpoint_url = new URL(WP_PATH_INSTALL_PLUGIN, site.base_url).toString();
  
  const response = await fetch(endpoint_url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${site.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plugin_url }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      error: errorData.message || 'Failed to install plugin',
      ok: response.ok,
      status: response.status,
    }
  }
  const data = await response.json();
  return data;
}
export async function flushSiteCache(siteId: string) {
  const site = await currentSite(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  const endpoint_url = new URL(WP_PATH_FLUSH_CACHE, site.base_url).toString();

  const response = await fetch(endpoint_url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${site.api_key}`,
    },
  }); 
  const data = await response.json();
  console.log("flush cache", data);
  return data;
  
}
export async function installPluginFile(siteId: string, pluginCode: string, pluginName: string) {
  const site = await currentSite(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  
  const endpoint_url = new URL(WP_PATH_INSTALL_PLUGIN_FILE, site.base_url).toString();
  
  const formData = new FormData();
  formData.append('plugin_code', pluginCode);
  formData.append('plugin_name', pluginName);

  try {
    const response = await fetch(endpoint_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${site.api_key}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || 'Failed to install plugin',
        ok: false,
        status: response.status,
      };
    }

    return {
      message: data.message,
      ok: true,
      status: response.status,
    };
  } catch (error) {
    return {
      error: 'Network error or server is unreachable',
      ok: false,
      status: 0,
    };
  }
}

export async function removePlugin(siteId: string, plugin_slug: string) {
  const site = await currentSite(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  
  const endpoint_url = new URL(WP_PATH_REMOVE_PLUGIN, site.base_url).toString();
  
  const response = await fetch(endpoint_url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${site.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plugin_slug }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      error: errorData.message || 'Failed to install plugin',
      ok: response.ok,
      status: response.status,
    }
  }
  const data = await response.json();
  return data;
}

export async function getAdminAutoLoginLink(siteId: string) {
  const site = await currentSite(siteId);
  if (!site) {
    throw new Error('Site not found');
  }
  const endpoint_url = new URL(WP_PATH_ADMIN_AUTO_LOGIN, site.base_url).toString();

  const response = await fetch(endpoint_url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${site.api_key}`,
    },
  });
  const data = await response.json();
  return data.auto_login_url;
}