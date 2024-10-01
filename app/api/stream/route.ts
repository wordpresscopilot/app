import { runWPSiteAgent } from '@/agents/wp-site-agent';
import { WpSite } from '@/types';
import { Message } from '@/types/export-pipeline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendUpdate = (data: any) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Keep the connection open by sending a comment every 15 seconds
  const keepAlive = setInterval(() => {
    writer.write(encoder.encode(': keep-alive\n\n'));
  }, 15000);

  req.signal.addEventListener('abort', () => {
    clearInterval(keepAlive);
    writer.close();
  });

  const { site, messages } = await req.json() as { site: WpSite, messages: Message[] };

  try {
    runWPSiteAgent({ site, messages }).catch((error) => {
      console.error('Error running WP Site Agent:', error);
      writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: error.message })}\n\n`));
      writer.close();
    });
  } catch (error) {
    console.error('Error parsing request:', error);
    writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: 'Invalid request data' })}\n\n`));
    writer.close();
  }

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}