"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookmarkCheck, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PracticeQuestion {
  id: string;
  text: string;
  imageUrl: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: { id: string; text: string }[];
  isBookmarked: boolean;
}

export function PracticeQuiz({
  topicTitle,
  questions,
}: {
  topicTitle: string;
  questions: PracticeQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [results, setResults] = useState<
    Record<string, { isCorrect: boolean; correctOptionId?: string; explanation: string; explanationImage: string | null }>
  >({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>(
    Object.fromEntries(questions.map((q) => [q.id, q.isBookmarked]))
  );
  const [loading, setLoading] = useState(false);

  const question = questions[index];
  const result = results[question?.id];

  async function selectOption(optionId: string) {
    if (result) return; // already answered
    setSelected((s) => ({ ...s, [question.id]: optionId }));
    setLoading(true);

    const res = await fetch("/api/quiz/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, selectedOptionId: optionId }),
    });
    const data = await res.json();
    setLoading(false);
    setResults((r) => ({ ...r, [question.id]: data }));
  }

  async function toggleBookmark() {
    setBookmarked((b) => ({ ...b, [question.id]: !b[question.id] }));
    await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id }),
    });
  }

  if (!question) {
    return (
      <Card className="p-8 text-center">
        <p className="font-ui text-sm text-muted">No questions available for this topic yet.</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-ui text-xs text-muted">{topicTitle}</p>
          <p className="font-ui text-sm font-semibold text-dark">
            Question {index + 1} of {questions.length}
          </p>
        </div>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="font-ui text-base font-medium text-dark">{question.text}</p>
          <button onClick={toggleBookmark} className="tap-target flex-shrink-0 text-accentGold">
            {bookmarked[question.id] ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {question.imageUrl && (
          <div className="relative mt-4 h-56 w-full overflow-hidden rounded-2xl">
            <Image src={question.imageUrl} alt="Question illustration" fill className="object-contain" />
          </div>
        )}

        <div className="mt-5 space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selected[question.id] === opt.id;
            const isCorrectOption = result?.correctOptionId === opt.id;
            const showResult = !!result;

            return (
              <button
                key={opt.id}
                disabled={!!result || loading}
                onClick={() => selectOption(opt.id)}
                className={cn(
                  "tap-target flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left font-ui text-sm transition-colors",
                  !showResult && "border-border hover:border-primary",
                  showResult && isCorrectOption && "border-accentGreen bg-accentGreen/10",
                  showResult && isSelected && !isCorrectOption && "border-hard bg-hard/10",
                  showResult && !isSelected && !isCorrectOption && "border-border opacity-60"
                )}
              >
                <span className="text-dark">{opt.text}</span>
                {showResult && isCorrectOption && <Check className="h-4 w-4 text-accentGreen" />}
                {showResult && isSelected && !isCorrectOption && <X className="h-4 w-4 text-hard" />}
              </button>
            );
          })}
        </div>

        {result && (
          <div
            className={cn(
              "mt-5 rounded-2xl p-4 font-ui text-sm",
              result.isCorrect ? "bg-accentGreen/10 text-dark" : "bg-hard/10 text-dark"
            )}
          >
            <p className="font-semibold">{result.isCorrect ? "Correct!" : "Not quite."}</p>
            <p className="mt-1 text-muted">{result.explanation}</p>
            {result.explanationImage && (
              <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl">
                <Image
                  src={result.explanationImage}
                  alt="Explanation illustration"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          disabled={index === questions.length - 1}
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
