import { prisma } from "@/lib/prisma";
import { SubjectCard } from "@/components/dashboard/subject-card";

export const revalidate = 3600;

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">All subjects</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        12 subjects covering the full pre-licensure and post-internship syllabus.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.id} slug={s.slug} name={s.name} icon={s.icon} color={s.color} />
        ))}
      </div>
    </div>
  );
}
