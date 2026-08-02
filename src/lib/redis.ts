import { Redis } from "@upstash/redis";

// Redis is optional in dev: if the Upstash env vars aren't set yet, every
// cache helper below becomes a silent no-op instead of crashing the page.
const isConfigured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const NOTE_TTL_SECONDS = 60 * 60; // 1 hour, per spec

export async function getCachedNote(noteId: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get<string>(`note:${noteId}`);
  } catch {
    return null;
  }
}

export async function setCachedNote(noteId: string, html: string) {
  if (!redis) return null;
  try {
    return await redis.set(`note:${noteId}`, html, { ex: NOTE_TTL_SECONDS });
  } catch {
    return null;
  }
}

export async function invalidateNoteCache(noteId: string) {
  if (!redis) return null;
  try {
    return await redis.del(`note:${noteId}`);
  } catch {
    return null;
  }
}
