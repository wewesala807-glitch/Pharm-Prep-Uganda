import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { DifficultyBadge, PremiumBadge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session!.user.id, questionId: { not: null } },
    orderBy: { createdAt: "desc" },
    include: {
      question: {
        include: { topic: { include: { subject: true } } },
      },
    },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Bookmarked questions</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        Questions you've saved for later review.
      </p>

      <div className="mt-6 space-y-3">
        {bookmarks.length === 0 && (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <Bookmark className="h-8 w-8 text-muted" />
            <p className="font-ui text-sm text-muted">
              No bookmarks yet. Tap the bookmark icon on any question during practice to save it here.
            </p>
          </Card>
        )}

        {bookmarks.map((b) => {
          const q = b.question!;
          return (
            <Card key={b.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-ui text-xs text-muted">
                    {q.topic.subject.name} · {q.topic.title}
                  </p>
                  <p className="mt-1 font-ui text-sm text-dark">{q.text}</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {q.isPremium && <PremiumBadge />}
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
              </div>
              <Link
                href={`/quiz/practice/${q.topicId}`}
                className="mt-3 inline-block font-ui text-sm font-semibold text-primary"
              >
                Practice this topic →
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
