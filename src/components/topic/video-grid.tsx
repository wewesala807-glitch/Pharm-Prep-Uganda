"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import "lite-youtube-embed/src/lite-yt-embed.css";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoGrid({ videos }: { videos: VideoItem[] }) {
  useEffect(() => {
    // Registers the <lite-youtube> custom element; only loads the real
    // YouTube iframe/JS once the user clicks play, keeping initial JS light.
    import("lite-youtube-embed");
  }, []);

  if (videos.length === 0) {
    return (
      <p className="font-ui text-sm text-muted">
        No videos yet for this topic.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {videos.map((v) => (
        <Card key={v.id} className="overflow-hidden p-0">
          <lite-youtube
            videoid={v.youtubeId}
            playlabel={v.title}
            style={{ aspectRatio: "16/9" }}
          />
          <div className="p-4">
            <p className="font-ui text-sm font-semibold text-dark">{v.title}</p>
            <p className="mt-0.5 font-ui text-xs text-muted">
              {formatDuration(v.duration)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
