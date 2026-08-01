import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Lock, CheckCircle2, FileText, Video, ListChecks } from "lucide-react";

export const revalidate = 3600;

export default async function SubjectDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const subject = await prisma.subject.findUnique({
    where: { slug: params.slug },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { notes: true, videos: true, questions: true } },
        },
      },
    },
  });

  if (!subject) notFound();

  const progress = await prisma.progress.findMany({
    where: { userId: session!.user.id, topicId: { in: subject.topics.map((t) => t.id) } },
  });
  const completedTopicIds = new Set(progress.filter((p) => p.completed).map((p) => p.topicId));
  const isFreeUser = session!.user.plan === "FREE";

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{subject.icon}</span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">{subject.name}</h1>
          <p className="font-ui text-sm text-muted">{subject.description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {subject.topics.map((topic) => {
          const locked = topic.isPremium && isFreeUser;
          const done = completedTopicIds.has(topic.id);

          return (
            <Link key={topic.id} href={locked ? "#" : `/subjects/${subject.slug}/${topic.slug}`}>
              <Card
                className="flex items-center justify-between p-5"
                style={{ borderLeftWidth: 4, borderLeftColor: subject.color }}
              >
                <div className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accentGreen" />
                  ) : (
                    <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-border" />
                  )}
                  <div>
                    <p className="font-ui font-semibold text-dark">{topic.title}</p>
                    <div className="mt-1 flex gap-3 font-ui text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> {topic._count.notes} notes
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" /> {topic._count.videos} videos
                      </span>
                      <span className="flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" /> {topic._count.questions} questions
                      </span>
                    </div>
                  </div>
                </div>

                {locked && <Lock className="h-5 w-5 flex-shrink-0 text-accentGold" />}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
