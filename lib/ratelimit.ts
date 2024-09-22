import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const ratelimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'plugin_ratelimit'
})

function getIP() {
  return headers().get('x-real-ip') ?? 'unknown'
}

export async function rateLimit() {
  const limit = await ratelimiter.limit(getIP())
  if (!limit.success) {
    redirect('/waiting-room')
  }
}