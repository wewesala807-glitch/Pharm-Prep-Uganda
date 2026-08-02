"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Loader2, Upload } from "lucide-react";

interface Props {
  subjects: { id: string; name: string }[];
  topics: { id: string; title: string; subjectId: string }[];
}

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

async function uploadImage(file: File, folder: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.url ?? null;
}

export function QuestionEditorForm({ subjects, topics }: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [examYear, setExamYear] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [options, setOptions] = useState<OptionInput[]>([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null);
  const [explanationImageFile, setExplanationImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const visibleTopics = topics.filter((t) => t.subjectId === subjectId);

  function updateOption(index: number, text: string) {
    setOptions((opts) => opts.map((o, i) => (i === index ? { ...o, text } : o)));
  }

  function setCorrect(index: number) {
    setOptions((opts) => opts.map((o, i) => ({ ...o, isCorrect: i === index })));
  }

  async function handleSave() {
    if (!topicId || !text.trim() || !explanation.trim() || options.some((o) => !o.text.trim())) {
      setStatus("Fill in the topic, question text, explanation, and all 4 options.");
      return;
    }
    setSaving(true);
    setStatus(null);

    try {
      const [imageUrl, explanationImage] = await Promise.all([
        questionImageFile ? uploadImage(questionImageFile, "questions") : Promise.resolve(null),
        explanationImageFile ? uploadImage(explanationImageFile, "explanations") : Promise.resolve(null),
      ]);

      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          text,
          explanation,
          difficulty,
          examYear: examYear ? Number(examYear) : null,
          isPremium,
          imageUrl,
          explanationImage,
          options,
        }),
      });

      if (res.ok) {
        setStatus("Question saved ✅");
        setText("");
        setExplanation("");
        setExamYear("");
        setQuestionImageFile(null);
        setExplanationImageFile(null);
        setOptions([
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]);
      } else {
        const data = await res.json();
        setStatus(data.error ?? "Failed to save question");
      }
    } finally {
      setSaving(false);
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
        <label className="mb-1.5 block font-ui text-sm font-medium text-dark">Question text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-white p-4 font-ui text-sm text-dark outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 flex items-center gap-2 font-ui text-sm font-medium text-dark">
          <Upload className="h-4 w-4" /> Question image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setQuestionImageFile(e.target.files?.[0] ?? null)}
          className="font-ui text-sm"
        />
      </div>

      <div className="mt-5 space-y-2.5">
        <p className="font-ui text-sm font-medium text-dark">Options — select the correct one</p>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="radio"
              name="correct-option"
              checked={opt.isCorrect}
              onChange={() => setCorrect(i)}
              className="h-4 w-4 flex-shrink-0"
            />
            <input
              value={opt.text}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="h-10 flex-1 rounded-2xl border border-border bg-white px-4 font-ui text-sm text-dark outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block font-ui text-sm font-medium text-dark">Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-white p-4 font-ui text-sm text-dark outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 flex items-center gap-2 font-ui text-sm font-medium text-dark">
          <Upload className="h-4 w-4" /> Explanation image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setExplanationImageFile(e.target.files?.[0] ?? null)}
          className="font-ui text-sm"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <select
          className={selectClass}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <Field
          label=""
          placeholder="Exam year (optional)"
          value={examYear}
          onChange={(e) => setExamYear(e.target.value)}
          type="number"
        />
        <label className="flex items-center gap-2 font-ui text-sm text-dark">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Premium question
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {status && <p className="font-ui text-sm text-dark">{status}</p>}
        <Button onClick={handleSave} disabled={saving} className="ml-auto">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save question"}
        </Button>
      </div>
    </Card>
  );
}
