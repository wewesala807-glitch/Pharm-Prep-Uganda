"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DifficultyBadge, PremiumBadge, Badge } from "@/components/ui/badge";

export interface QuestionRow {
  id: string;
  text: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPremium: boolean;
  examYear: number | null;
  imageUrl: string | null;
  topicId: string;
  topicTitle: string;
  subjectName: string;
}

const PAGE_SIZE = 20;

export function QuestionBankClient({ questions }: { questions: QuestionRow[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const fuse = useMemo(
    () =>
      new Fuse(questions, {
        keys: ["text", "topicTitle", "subjectName"],
        threshold: 0.35,
      }),
    [questions]
  );

  const results = useMemo(() => {
    if (!query.trim()) return questions;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, questions]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search questions, topics, subjects..."
          className="h-11 w-full rounded-2xl border border-border bg-white pl-11 pr-4 font-ui text-sm text-dark outline-none focus:border-primary"
        />
      </div>

      <p className="mt-3 font-ui text-sm text-muted">{results.length} questions found</p>

      <div className="mt-3 space-y-3">
        {paged.map((q, i) => (
          <Card key={q.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-ui text-xs text-muted">
                  {q.subjectName} · {q.topicTitle}
                </p>
                <p className="mt-1 font-ui text-sm text-dark">
                  <span className="font-semibold text-muted">
                    {(page - 1) * PAGE_SIZE + i + 1}.
                  </span>{" "}
                  {q.text}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <div className="flex gap-2">
                  {q.isPremium && <PremiumBadge />}
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                <div className="flex gap-2">
                  {q.examYear && <Badge tone="neutral">{q.examYear}</Badge>}
                  {q.imageUrl && (
                    <Badge tone="neutral">
                      <ImageIcon className="h-3 w-3" /> image
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/quiz/practice/${q.topicId}`}
              className="mt-3 inline-block font-ui text-sm font-semibold text-primary"
            >
              Practice this topic →
            </Link>
          </Card>
        ))}

        {paged.length === 0 && (
          <p className="py-10 text-center font-ui text-sm text-muted">
            No questions match your filters.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="tap-target rounded-2xl border border-border p-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-ui text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="tap-target rounded-2xl border border-border p-2 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
