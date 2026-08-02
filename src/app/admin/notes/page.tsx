import { prisma } from "@/lib/prisma";
import { NoteEditorForm } from "@/components/admin/note-editor-form";

export default async function AdminNotesPage() {
  const [subjects, topics] = await Promise.all([
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
    prisma.topic.findMany({ select: { id: true, title: true, subjectId: true } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Note editor</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        Write study notes with rich formatting, tables, and inline images.
      </p>

      <div className="mt-6">
        <NoteEditorForm subjects={subjects} topics={topics} />
      </div>
    </div>
  );
}
