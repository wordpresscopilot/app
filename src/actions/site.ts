'use server';

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Unkey } from "@unkey/api";
import { v4 as uuidV4 } from "uuid";

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

export async function createSiteProject(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error('User not found');

  const name = formData.get('name') as string;
  const baseUrl = formData.get('baseUrl') as string;
  const new_site_id = uuidV4();

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
  return await prisma.wp_site.create({
    data: {
      id: uuidV4(),
      user_id: user.id,
      name,
      base_url: baseUrl,
      api_key: created_key?.result?.key!
    },
  });
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

export async function retrieveSites({
  user_id,
}: {
  user_id: string;
}) {
  return await prisma.wp_site.findMany({
    where: {
      user_id,
    },
  });
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
        connected: response.ok
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
  }
  return false;
}
