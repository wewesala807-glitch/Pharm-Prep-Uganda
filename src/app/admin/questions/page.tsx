import { prisma } from "@/lib/prisma";
import { QuestionEditorForm } from "@/components/admin/question-editor-form";

export default async function AdminQuestionsPage() {
  const [subjects, topics] = await Promise.all([
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
    prisma.topic.findMany({ select: { id: true, title: true, subjectId: true } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Question editor</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        Add a new MCQ practice question with its four options and explanation.
      </p>

      <div className="mt-6">
        <QuestionEditorForm subjects={subjects} topics={topics} />
      </div>
    </div>
  );
}
