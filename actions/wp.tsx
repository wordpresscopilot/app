import { currentSite } from "@/data/site";
import {
  WP_PATH_GET_PLUGINS,
  WP_PATH_RUN_SQL,
  WP_PATH_SITE_INFO,
} from "@/lib/paths";

export async function executeWordPressSQL({
  query,
  api_key,
  api_url,
}: {
  query: string;
  api_key: string;
  api_url: string;
}): Promise<any> {
  try {
    console.log({
      query,
      api_key,
      api_url,
    });
    console.log("`${api_url}?c=${api_key}`", `${api_url}?api_key=${api_key}`);
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${api_key}`,
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        status: response.status,
        ok: response.ok,
        error: errorData || {
          message: `HTTP error! status: ${response.status}`,
        },
      };
    }

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error executing WordPress SQL:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function getCurrentSitePlugins({
  site_id,
}: {
  site_id: string;
}): Promise<any> {
  const site = await currentSite(site_id);
  if (!site) return;
  const url = `${site.base_url}${WP_PATH_GET_PLUGINS}`;
  console.log("url getCurrentSitePlugins", url);
  console.log("site?.api_key", site?.api_key);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${site?.api_key}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.log("errorData getCurrentSitePlugins", errorData);
    return {
      status: response.status,
      ok: response.ok,
      error: errorData || {
        message: `HTTP error! status: ${response.status}`,
      },
    };
  }
  const data = await response.json();
  console.log("data getCurrentSitePlugins", data);
  return data;
}

export async function getCurrentSiteInfo({
  site_id,
}: {
  site_id: string;
}): Promise<any> {
  const site = await currentSite(site_id);
  if (!site) return;
  const url = `${site.base_url}${WP_PATH_SITE_INFO}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${site?.api_key}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    return {
      status: response.status,
      ok: response.ok,
      error: errorData || {
        message: `HTTP error! status: ${response.status}`,
      },
    };
  }
  const data = await response.json();
  return data;
}

export async function executeWordPressSQLWithSiteID({
  query,
  site_id,
}: {
  query: string;
  site_id: string;
}): Promise<any> {
  const site = await currentSite(site_id);
  if (!site) return;
  try {
    const url = `${site.base_url}${WP_PATH_RUN_SQL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${site?.api_key}`,
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        status: response.status,
        ok: response.ok,
        error: errorData || {
          message: `HTTP error! status: ${response.status}`,
        },
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error executing WordPress SQL:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
