"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { extractYouTubeId } from "@/lib/youtube";
import { CheckCircle2 } from "lucide-react";

interface Props {
  subjects: { id: string; name: string }[];
  topics: { id: string; title: string; subjectId: string }[];
}

export function VideoManagerForm({ subjects, topics }: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const videoId = extractYouTubeId(url);
  const visibleTopics = topics.filter((t) => t.subjectId === subjectId);

  async function handleSave() {
    if (!topicId || !videoId || !title.trim()) {
      setStatus("Paste a valid YouTube URL, pick a topic, and enter a title.");
      return;
    }
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId,
        title,
        description,
        youtubeId: videoId,
        order: Number(order) || 0,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setStatus("Video added ✅");
      setUrl("");
      setTitle("");
      setDescription("");
    } else {
      const data = await res.json();
      setStatus(data.error ?? "Failed to add video");
    }
  }

  const selectClass =
    "h-10 rounded-2xl border border-border bg-white px-3 font-ui text-sm text-dark outline-none focus:border-primary";

  return (
    <Card className="p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          className={selectClass}
          value={subjectId}
          onChange={(e) => {
            setSubjectId(e.target.value);
            setTopicId("");
          }}
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          disabled={!subjectId}
        >
          <option value="">Select topic</option>
          {visibleTopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <Field
          label="YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {videoId && (
          <p className="mt-1.5 flex items-center gap-1.5 font-ui text-xs text-accentGreen">
            <CheckCircle2 className="h-3.5 w-3.5" /> Video ID detected: {videoId}
          </p>
        )}
      </div>

      <div className="mt-4">
        <Field label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-ui text-sm font-medium text-dark">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-2xl border border-border bg-white p-4 font-ui text-sm text-dark outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4 max-w-xs">
        <Field
          label="Display order"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        {status && <p className="font-ui text-sm text-dark">{status}</p>}
        <Button onClick={handleSave} disabled={saving} className="ml-auto">
          {saving ? "Saving..." : "Add video"}
        </Button>
      </div>
    </Card>
  );
}
