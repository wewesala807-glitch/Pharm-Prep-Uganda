import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatUGX } from "@/lib/utils";
import { Users, CreditCard, TrendingUp } from "lucide-react";
import { AdminSubjectScoreChart } from "@/components/admin/subject-score-chart";

export default async function AdminOverviewPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalUsers, payingUsers, revenueThisMonth, topicEngagement, attempts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PREMIUM" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.progress.groupBy({
      by: ["topicId"],
      _count: { topicId: true },
      orderBy: { _count: { topicId: "desc" } },
      take: 5,
    }),
    prisma.quizAttempt.findMany({
      include: { question: { include: { topic: { include: { subject: true } } } } },
    }),
  ]);

  const topicIds = topicEngagement.map((t) => t.topicId);
  const topics = await prisma.topic.findMany({
    where: { id: { in: topicIds } },
    include: { subject: { select: { name: true } } },
  });
  const topicMap = new Map(topics.map((t) => [t.id, t]));

  const mostEngagedTopics = topicEngagement.map((t) => ({
    title: topicMap.get(t.topicId)?.title ?? "Unknown topic",
    subject: topicMap.get(t.topicId)?.subject.name ?? "",
    count: t._count.topicId,
  }));

  const bySubject: Record<string, { correct: number; total: number }> = {};
  for (const a of attempts) {
    const name = a.question.topic.subject.name;
    bySubject[name] ??= { correct: 0, total: 0 };
    bySubject[name].total += 1;
    if (a.isCorrect) bySubject[name].correct += 1;
  }
  const subjectScores = Object.entries(bySubject).map(([subject, s]) => ({
    subject,
    percent: Math.round((s.correct / s.total) * 100),
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Admin overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-dark">{totalUsers}</p>
            <p className="font-ui text-xs text-muted">Total users</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-premium/10 text-premium">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-dark">{payingUsers}</p>
            <p className="font-ui text-xs text-muted">Premium users</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accentGreen/10 text-accentGreen">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-dark">
              {formatUGX(revenueThisMonth._sum.amount ?? 0)}
            </p>
            <p className="font-ui text-xs text-muted">Revenue this month</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Most-engaged topics</h2>
          <p className="mt-1 font-ui text-xs text-muted">By number of students with progress recorded</p>
          <div className="mt-4 space-y-3">
            {mostEngagedTopics.length === 0 && (
              <p className="font-ui text-sm text-muted">No topic activity yet.</p>
            )}
            {mostEngagedTopics.map((t) => (
              <div key={t.title} className="flex items-center justify-between">
                <div>
                  <p className="font-ui text-sm font-medium text-dark">{t.title}</p>
                  <p className="font-ui text-xs text-muted">{t.subject}</p>
                </div>
                <span className="font-ui text-sm font-semibold text-primary">{t.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Average quiz score by subject</h2>
          {subjectScores.length === 0 ? (
            <p className="mt-3 font-ui text-sm text-muted">No quiz attempts recorded yet.</p>
          ) : (
            <AdminSubjectScoreChart data={subjectScores} />
          )}
        </Card>
      </div>
    </div>
  );
}
