import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MockExam } from "@/components/quiz/mock-exam";
import { Lock, Timer, ListChecks } from "lucide-react";

export default async function MockExamPage() {
  const session = await getServerSession(authOptions);

  if (session!.user.plan === "FREE") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <Card className="p-8">
          <Lock className="mx-auto h-10 w-10 text-accentGold" />
          <h1 className="mt-4 font-heading text-xl font-bold text-dark">
            Full mock exams are a Premium feature
          </h1>
          <p className="mt-2 font-ui text-sm text-muted">
            Simulate the real 100-question, 3-hour licensing exam with a Premium subscription.
          </p>
          <Link href="/settings?upgrade=1">
            <Button className="mt-5" variant="premium">
              Upgrade to Premium
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const allIds = await prisma.question.findMany({ select: { id: true } });
  const shuffled = allIds.map((q) => q.id).sort(() => Math.random() - 0.5);
  const pickedIds = shuffled.slice(0, Math.min(100, shuffled.length));

  const questions = await prisma.question.findMany({
    where: { id: { in: pickedIds } },
    include: {
      options: { orderBy: { order: "asc" } },
      topic: { include: { subject: { select: { name: true } } } },
    },
  });

  const examQuestions = questions.map((q) => ({
    id: q.id,
    text: q.text,
    imageUrl: q.imageUrl,
    subjectName: q.topic.subject.name,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  }));

  return <MockExam questions={examQuestions} />;
}
