import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FilterBar } from "@/components/questions/filter-bar";
import { QuestionBankClient } from "@/components/questions/question-bank-client";

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: { subject?: string; topic?: string; difficulty?: string; year?: string; hasImage?: string };
}) {
  const where: Prisma.QuestionWhereInput = {};

  if (searchParams.topic) {
    where.topicId = searchParams.topic;
  } else if (searchParams.subject) {
    where.topic = { subjectId: searchParams.subject };
  }
  if (searchParams.difficulty) {
    where.difficulty = searchParams.difficulty as Prisma.QuestionWhereInput["difficulty"];
  }
  if (searchParams.year) {
    where.examYear = Number(searchParams.year);
  }
  if (searchParams.hasImage === "yes") where.imageUrl = { not: null };
  if (searchParams.hasImage === "no") where.imageUrl = null;

  const [questions, subjects, topics, yearsRaw] = await Promise.all([
    prisma.question.findMany({
      where,
      take: 1000,
      orderBy: { examYear: "desc" },
      select: {
        id: true,
        text: true,
        difficulty: true,
        isPremium: true,
        examYear: true,
        imageUrl: true,
        topicId: true,
        topic: { select: { title: true, subject: { select: { name: true } } } },
      },
    }),
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
    prisma.topic.findMany({ select: { id: true, title: true, subjectId: true } }),
    prisma.question.findMany({
      where: { examYear: { not: null } },
      select: { examYear: true },
      distinct: ["examYear"],
      orderBy: { examYear: "desc" },
    }),
  ]);

  const rows = questions.map((q) => ({
    id: q.id,
    text: q.text,
    difficulty: q.difficulty,
    isPremium: q.isPremium,
    examYear: q.examYear,
    imageUrl: q.imageUrl,
    topicId: q.topicId,
    topicTitle: q.topic.title,
    subjectName: q.topic.subject.name,
  }));

  const years = yearsRaw.map((y) => y.examYear!).filter(Boolean);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Question bank</h1>
      <p className="mt-1 font-ui text-sm text-muted">
        Search and filter across every practice question on the platform.
      </p>

      <div className="mt-5">
        <FilterBar subjects={subjects} topics={topics} years={years} />
      </div>

      <div className="mt-6">
        <QuestionBankClient questions={rows} />
      </div>
    </div>
  );
}
