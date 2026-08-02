import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SubmittedAnswer {
  questionId: string;
  selectedOptionId?: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers, timeTakenSeconds } = (await req.json()) as {
    answers: SubmittedAnswer[];
    timeTakenSeconds: number;
  };

  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    include: {
      options: true,
      topic: { include: { subject: { select: { name: true } } } },
    },
  });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let correctCount = 0;
  const subjectStats: Record<string, { correct: number; total: number }> = {};
  const attemptRows: {
    userId: string;
    questionId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
  }[] = [];

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const correctOption = question.options.find((o) => o.isCorrect);
    const isCorrect = !!answer.selectedOptionId && correctOption?.id === answer.selectedOptionId;
    if (isCorrect) correctCount += 1;

    const subjectName = question.topic.subject.name;
    subjectStats[subjectName] ??= { correct: 0, total: 0 };
    subjectStats[subjectName].total += 1;
    if (isCorrect) subjectStats[subjectName].correct += 1;

    attemptRows.push({
      userId: session.user.id,
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId ?? null,
      isCorrect,
    });
  }

  await prisma.quizAttempt.createMany({ data: attemptRows });

  const total = answers.length;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const subjectBreakdown = Object.entries(subjectStats).map(([subject, stat]) => ({
    subject,
    correct: stat.correct,
    total: stat.total,
    percent: Math.round((stat.correct / stat.total) * 100),
  }));

  return NextResponse.json({
    correctCount,
    total,
    scorePercent,
    timeTakenSeconds,
    subjectBreakdown,
  });
}
