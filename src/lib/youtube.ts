export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?&\s]+)/,
    /(?:youtube\.com\/embed\/)([^?&\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  // Already a bare 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

  return null;
}
