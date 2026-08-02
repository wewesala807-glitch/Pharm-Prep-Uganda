import { prisma } from "@/lib/prisma";
import { VideoManagerForm } from "@/components/admin/video-manager-form";

export default async function AdminVideosPage() {
  const [subjects, topics] = await Promise.all([
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
    prisma.topic.findMany({ select: { id: true, title: true, subjectId: true } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Video manager</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        Paste a YouTube URL — the video ID is extracted automatically.
      </p>

      <div className="mt-6">
        <VideoManagerForm subjects={subjects} topics={topics} />
      </div>
    </div>
  );
}
