import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { QuizPerformanceChart } from "@/components/dashboard/quiz-performance-chart";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight, AlertTriangle } from "lucide-react";
import { calculateStreak } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [subjects, allProgress, recentAttempts, lastProgress, attemptDates] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: { topics: { select: { id: true } } },
    }),
    prisma.progress.findMany({ where: { userId } }),
    prisma.quizAttempt.findMany({
      where: { userId, createdAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.progress.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { topic: { include: { subject: true } } },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { createdAt: true },
      distinct: ["createdAt"],
    }),
  ]);

  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedTopics = allProgress.filter((p) => p.completed).length;
  const overallPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const subjectCards = subjects.map((s) => {
    const topicIds = new Set(s.topics.map((t) => t.id));
    const subjectProgress = allProgress.filter((p) => topicIds.has(p.topicId));
    const done = subjectProgress.filter((p) => p.completed).length;
    const pct = s.topics.length > 0 ? Math.round((done / s.topics.length) * 100) : 0;
    return { ...s, progress: pct };
  });

  const weakSubjects = subjectCards.filter((s) => {
    const scores = allProgress.filter((p) => s.topics.some((t) => t.id === p.topicId) && p.lastQuizScore != null);
    if (scores.length === 0) return false;
    const avg = scores.reduce((sum, p) => sum + (p.lastQuizScore ?? 0), 0) / scores.length;
    return avg < 60;
  });

  // Build last-7-days accuracy series
  const chartData: { day: string; accuracy: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayAttempts = recentAttempts.filter(
      (a) => a.createdAt.toDateString() === date.toDateString()
    );
    const accuracy =
      dayAttempts.length > 0
        ? Math.round((dayAttempts.filter((a) => a.isCorrect).length / dayAttempts.length) * 100)
        : 0;
    chartData.push({ day: dayLabel, accuracy });
  }

  const streak = calculateStreak(attemptDates.map((a) => a.createdAt.toDateString()));

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">
            Welcome back, {session!.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 font-ui text-sm text-muted">Here&apos;s where your revision stands.</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 rounded-2xl bg-accentGold/10 px-4 py-2 font-ui text-sm font-semibold text-accentGold">
            <Flame className="h-5 w-5" /> {streak}-day streak
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex items-center justify-center p-6 md:col-span-1">
          <ProgressRing percent={overallPercent} />
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-dark">Quiz accuracy — last 7 days</h2>
          <QuizPerformanceChart data={chartData} />
        </Card>
      </div>

      {lastProgress && (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
              Continue where you left off
            </p>
            <p className="mt-1 font-heading text-lg font-semibold text-dark">
              {lastProgress.topic.title}
            </p>
            <p className="font-ui text-sm text-muted">{lastProgress.topic.subject.name}</p>
          </div>
          <Link href={`/subjects/${lastProgress.topic.subject.slug}/${lastProgress.topic.slug}`}>
            <Button>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      )}

      {weakSubjects.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-dark">
            <AlertTriangle className="h-5 w-5 text-hard" /> Subjects needing attention
          </h2>
          <p className="mt-1 font-ui text-sm text-muted">Scoring below 60% average — worth revisiting.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {weakSubjects.map((s) => (
              <Link
                key={s.id}
                href={`/subjects/${s.slug}`}
                className="rounded-full bg-hard/10 px-3 py-1.5 font-ui text-sm font-medium text-hard"
              >
                {s.icon} {s.name}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold text-dark">Your subjects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectCards.map((s) => (
            <SubjectCard
              key={s.id}
              slug={s.slug}
              name={s.name}
              icon={s.icon}
              color={s.color}
              progress={s.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
