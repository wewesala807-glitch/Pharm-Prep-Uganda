import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const NOTE_TTL_SECONDS = 60 * 60; // 1 hour, per spec

export async function getCachedNote(noteId: string) {
  return redis.get<string>(`note:${noteId}`);
}

export async function setCachedNote(noteId: string, html: string) {
  return redis.set(`note:${noteId}`, html, { ex: NOTE_TTL_SECONDS });
}

export async function invalidateNoteCache(noteId: string) {
  return redis.del(`note:${noteId}`);
}
