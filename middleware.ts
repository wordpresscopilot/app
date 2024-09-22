import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from './lib/prisma';


export async function AddSiteIDSearchParams(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.includes('/sites/')) {
    const siteId = pathname.split('/sites/')[1].split('/')[0];
    if (siteId) {
      const url = new URL(req.url);
      url.searchParams.set('site_id', siteId);
      return NextResponse.rewrite(url);
    }
  }
  if (pathname.includes('/chat/')) {
    const chatId = pathname.split('/chat/')[1].split('/')[0];
    if (chatId) {
      try {
        const chat = await prisma.chat.findUnique({
          where: {
            id: chatId
          }
        });
        if (chat) {
          const url = new URL(req.url);
          url.searchParams.set('chat_id', chatId);
          url.searchParams.set('site_id', chat?.siteId);
          return NextResponse.rewrite(url);
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    }
  }
  return NextResponse.next();
};


const isProtectedRoute = createRouteMatcher([
  "/sites",
  "/sites(.*)",
  "/dashboard",

]);



export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  const response = AddSiteIDSearchParams(req);
  return response;

})



export const config = {
  matcher: [
    '/',
    "/((?!_next|_vercel|.*\\..*).*)",
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Match routes with sites/
    '/sites/:id*',
  ],
};
