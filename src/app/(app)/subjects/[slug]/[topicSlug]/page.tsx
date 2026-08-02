import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedNote, setCachedNote } from "@/lib/redis";
import { TopicTabs } from "@/components/topic/topic-tabs";
import { NoteCard } from "@/components/topic/note-card";
import { VideoGrid } from "@/components/topic/video-grid";
import { QuestionsTab } from "@/components/topic/questions-tab";

export default async function TopicPage({
  params,
}: {
  params: { slug: string; topicSlug: string };
}) {
  const session = await getServerSession(authOptions);
  const isFreeUser = session!.user.plan === "FREE";

  const topic = await prisma.topic.findFirst({
    where: { slug: params.topicSlug, subject: { slug: params.slug } },
    include: {
      subject: true,
      notes: { orderBy: { createdAt: "asc" } },
      videos: { orderBy: { order: "asc" } },
      questions: {
        orderBy: { difficulty: "asc" },
        select: { id: true, text: true, difficulty: true, isPremium: true, examYear: true },
      },
    },
  });

  if (!topic) notFound();

  // Redis-cache each note's HTML content for 1 hour, per spec, to avoid
  // re-serving large TipTap HTML payloads from Postgres on every view.
  const notesWithContent = await Promise.all(
    topic.notes.map(async (note) => {
      let html: string | null = null;
      try {
        const cached = await getCachedNote(note.id);
        html = cached ?? null;
      } catch {
        html = null;
      }
      if (!html) {
        html = note.content;
        setCachedNote(note.id, note.content).catch(() => {});
      }
      return { ...note, content: html };
    })
  );

  const notesTab = (
    <div className="space-y-5">
      {notesWithContent.length === 0 && (
        <p className="font-ui text-sm text-muted">No notes published for this topic yet.</p>
      )}
      {notesWithContent.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          content={note.content}
          isPremium={note.isPremium}
          isLocked={note.isPremium && isFreeUser}
        />
      ))}
    </div>
  );

  const videosTab = (
    <VideoGrid
      videos={topic.videos.map((v) => ({
        id: v.id,
        title: v.title,
        youtubeId: v.youtubeId,
        duration: v.duration,
      }))}
    />
  );

  const questionsTab = <QuestionsTab topicId={topic.id} questions={topic.questions} />;

  return (
    <div>
      <p className="font-ui text-sm text-muted">{topic.subject.name}</p>
      <h1 className="font-heading text-2xl font-bold text-dark">{topic.title}</h1>
      <p className="mt-1 max-w-2xl font-ui text-sm text-muted">{topic.description}</p>

      <div className="mt-6">
        <TopicTabs notes={notesTab} videos={videosTab} questions={questionsTab} />
      </div>
    </div>
  );
}
