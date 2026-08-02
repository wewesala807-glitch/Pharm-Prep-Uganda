import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PracticeQuizPage({ params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions);
  const isFreeUser = session!.user.plan === "FREE";

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: {
      questions: {
        where: isFreeUser ? { isPremium: false } : {},
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!topic) notFound();

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session!.user.id, questionId: { in: topic.questions.map((q) => q.id) } },
  });
  const bookmarkedIds = new Set(bookmarks.map((b) => b.questionId));

  const questions = topic.questions.map((q) => ({
    id: q.id,
    text: q.text,
    imageUrl: q.imageUrl,
    difficulty: q.difficulty,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
    isBookmarked: bookmarkedIds.has(q.id),
  }));

  const hiddenPremiumCount = isFreeUser
    ? await prisma.question.count({ where: { topicId: topic.id, isPremium: true } })
    : 0;

  return (
    <div>
      {hiddenPremiumCount > 0 && (
        <Card className="mb-5 flex flex-wrap items-center justify-between gap-3 border-accentGold/30 bg-accentGold/5 p-4">
          <p className="font-ui text-sm text-dark">
            {hiddenPremiumCount} more question{hiddenPremiumCount > 1 ? "s" : ""} available on Premium.
          </p>
          <Link href="/settings?upgrade=1">
            <Button size="sm" variant="premium">
              Upgrade
            </Button>
          </Link>
        </Card>
      )}
      <PracticeQuiz topicTitle={topic.title} questions={questions} />
    </div>
  );
}
