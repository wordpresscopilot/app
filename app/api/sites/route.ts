import { retrieveSites } from "@/data/site";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sites = await retrieveSites({ user_id: userId });
  return NextResponse.json(sites);
}
