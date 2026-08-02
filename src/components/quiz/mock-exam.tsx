"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MockQuestion {
  id: string;
  text: string;
  imageUrl: string | null;
  subjectName: string;
  options: { id: string; text: string }[];
}

const EXAM_SECONDS = 3 * 60 * 60;

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export function MockExam({ questions }: { questions: MockQuestion[] }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [submitting, setSubmitting] = useState(false);

  const submitExam = useCallback(async () => {
    setSubmitting(true);
    const timeTakenSeconds = EXAM_SECONDS - secondsLeft;

    const res = await fetch("/api/quiz/mock/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        })),
        timeTakenSeconds,
      }),
    });
    const summary = await res.json();
    sessionStorage.setItem("pharmaprep-mock-result", JSON.stringify(summary));
    router.push("/quiz/mock/results");
  }, [answers, secondsLeft, router]);

  useEffect(() => {
    if (!started) return;
    if (secondsLeft <= 0) {
      submitExam();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, secondsLeft, submitExam]);

  if (!started) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <Card className="p-8">
          <h1 className="font-heading text-xl font-bold text-dark">Ready for your mock exam?</h1>
          <p className="mt-2 font-ui text-sm text-muted">
            {questions.length} questions · 3-hour timer · no feedback until you submit. The timer
            starts the moment you click begin.
          </p>
          <Button className="mt-5" size="lg" onClick={() => setStarted(true)}>
            Begin mock exam
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[index];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-ui text-sm font-semibold text-dark">
          Question {index + 1} of {questions.length}
        </p>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 font-ui text-sm font-bold",
            secondsLeft < 600 ? "bg-hard/10 text-hard" : "bg-primary/10 text-primary"
          )}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>

      {/* Question navigator grid */}
      <div className="mb-5 grid grid-cols-10 gap-1.5 sm:grid-cols-20">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setIndex(i)}
            className={cn(
              "tap-target aspect-square rounded-lg font-ui text-[11px] font-semibold",
              i === index && "ring-2 ring-primary",
              answers[q.id] ? "bg-accentGreen/20 text-accentGreen" : "bg-bg text-muted"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card className="p-6">
        <p className="font-ui text-xs text-muted">{question.subjectName}</p>
        <p className="mt-1 font-ui text-base font-medium text-dark">{question.text}</p>

        {question.imageUrl && (
          <div className="relative mt-4 h-56 w-full overflow-hidden rounded-2xl">
            <Image src={question.imageUrl} alt="Question illustration" fill className="object-contain" />
          </div>
        )}

        <div className="mt-5 space-y-2.5">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAnswers((a) => ({ ...a, [question.id]: opt.id }))}
              className={cn(
                "tap-target w-full rounded-2xl border px-4 py-3 text-left font-ui text-sm text-dark transition-colors",
                answers[question.id] === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          Previous
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
        ) : (
          <Button variant="accent" disabled={submitting} onClick={submitExam}>
            {submitting ? "Submitting..." : "Submit exam"}
          </Button>
        )}
      </div>
    </div>
  );
}
