import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { calculateStreak } from "@/lib/utils";
import { Flame, Target, ListChecks } from "lucide-react";
import { SubjectPerformanceChart } from "@/components/dashboard/subject-performance-chart";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { question: { include: { topic: { include: { subject: true } } } } },
  });

  const distinctQuestionsAnswered = new Set(attempts.map((a) => a.questionId)).size;
  const accuracy =
    attempts.length > 0
      ? Math.round((attempts.filter((a) => a.isCorrect).length / attempts.length) * 100)
      : 0;
  const streak = calculateStreak(attempts.map((a) => a.createdAt.toDateString()));

  const bySubject: Record<string, { correct: number; total: number }> = {};
  for (const a of attempts) {
    const name = a.question.topic.subject.name;
    bySubject[name] ??= { correct: 0, total: 0 };
    bySubject[name].total += 1;
    if (a.isCorrect) bySubject[name].correct += 1;
  }
  const chartData = Object.entries(bySubject).map(([subject, s]) => ({
    subject,
    percent: Math.round((s.correct / s.total) * 100),
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Your progress</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center p-6">
          <Flame className="h-6 w-6 text-accentGold" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">{streak}</p>
          <p className="font-ui text-xs text-muted">Day streak</p>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <ListChecks className="h-6 w-6 text-primary" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">{distinctQuestionsAnswered}</p>
          <p className="font-ui text-xs text-muted">Questions answered</p>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <Target className="h-6 w-6 text-accentGreen" />
          <p className="mt-2 font-heading text-2xl font-bold text-dark">{accuracy}%</p>
          <p className="font-ui text-xs text-muted">Overall accuracy</p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-heading text-lg font-semibold text-dark">Performance by subject</h2>
        {chartData.length === 0 ? (
          <p className="mt-3 font-ui text-sm text-muted">
            Answer some practice questions to see your subject breakdown here.
          </p>
        ) : (
          <SubjectPerformanceChart data={chartData} />
        )}
      </Card>
    </div>
  );
}
