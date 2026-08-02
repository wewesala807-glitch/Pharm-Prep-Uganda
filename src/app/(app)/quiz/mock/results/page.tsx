"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Target } from "lucide-react";

interface MockResult {
  correctCount: number;
  total: number;
  scorePercent: number;
  timeTakenSeconds: number;
  subjectBreakdown: { subject: string; correct: number; total: number; percent: number }[];
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function MockResultsPage() {
  const [result, setResult] = useState<MockResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pharmaprep-mock-result");
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <Card className="p-8">
          <p className="font-ui text-sm text-muted">No recent mock exam result found.</p>
          <Link href="/quiz/mock">
            <Button className="mt-4">Start a mock exam</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-dark">Mock exam results</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center p-6">
          <Target className="h-6 w-6 text-primary" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">{result.scorePercent}%</p>
          <p className="font-ui text-xs text-muted">Overall score</p>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <CheckCircle2 className="h-6 w-6 text-accentGreen" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">
            {result.correctCount}/{result.total}
          </p>
          <p className="font-ui text-xs text-muted">Correct answers</p>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <Clock className="h-6 w-6 text-accentGold" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">
            {formatDuration(result.timeTakenSeconds)}
          </p>
          <p className="font-ui text-xs text-muted">Time taken</p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-heading text-lg font-semibold text-dark">Score by subject</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.subjectBreakdown} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis
                type="category"
                dataKey="subject"
                width={140}
                tick={{ fontSize: 11, fill: "#0F172A" }}
              />
              <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
              <Bar dataKey="percent" fill="#1A56DB" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
        <Link href="/quiz/mock">
          <Button>Take another mock exam</Button>
        </Link>
      </div>
    </div>
  );
}
