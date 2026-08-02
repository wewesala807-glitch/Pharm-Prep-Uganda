"use client";

import { useState } from "react";
import { NoteEditor } from "@/components/admin/note-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

interface Props {
  subjects: { id: string; name: string }[];
  topics: { id: string; title: string; subjectId: string }[];
}

export function NoteEditorForm({ subjects, topics }: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p>Start writing...</p>");
  const [isPremium, setIsPremium] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const visibleTopics = topics.filter((t) => t.subjectId === subjectId);

  async function handleSave() {
    if (!topicId || !title.trim()) {
      setStatus("Pick a topic and enter a title first.");
      return;
    }
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, title, content, isPremium }),
    });

    setSaving(false);
    if (res.ok) {
      setStatus("Note saved ✅");
      setTitle("");
      setContent("<p>Start writing...</p>");
    } else {
      const data = await res.json();
      setStatus(data.error ?? "Failed to save note");
    }
  }

  const selectClass =
    "h-10 rounded-2xl border border-border bg-white px-3 font-ui text-sm text-dark outline-none focus:border-primary";

  return (
    <div>
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
        <Field label="Note title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mt-4">
        <NoteEditor content={content} onChange={setContent} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 font-ui text-sm text-dark">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Premium note
        </label>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save note"}
        </Button>
      </div>

      {status && (
        <Card className="mt-4 p-3 text-center font-ui text-sm text-dark">{status}</Card>
      )}
    </div>
  );
}
