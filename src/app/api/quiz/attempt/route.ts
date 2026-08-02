import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionId, selectedOptionId } = await req.json();
  if (!questionId) {
    return NextResponse.json({ error: "questionId is required" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { options: true },
  });
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = !!selectedOption?.isCorrect;

  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      questionId,
      selectedOptionId: selectedOptionId ?? null,
      isCorrect,
    },
  });

  // Recompute rolling progress for this topic
  const topicId = question.topicId;
  const [totalQuestions, attempts] = await Promise.all([
    prisma.question.count({ where: { topicId } }),
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id, question: { topicId } },
      select: { questionId: true, isCorrect: true },
    }),
  ]);

  const attemptedQuestionIds = new Set(attempts.map((a) => a.questionId));
  const accuracy =
    attempts.length > 0 ? (attempts.filter((a) => a.isCorrect).length / attempts.length) * 100 : 0;
  const completed = attemptedQuestionIds.size >= totalQuestions && totalQuestions > 0;

  await prisma.progress.upsert({
    where: { userId_topicId: { userId: session.user.id, topicId } },
    update: { lastQuizScore: accuracy, completed },
    create: { userId: session.user.id, topicId, lastQuizScore: accuracy, completed },
  });

  return NextResponse.json({
    isCorrect,
    correctOptionId: question.options.find((o) => o.isCorrect)?.id,
    explanation: question.explanation,
    explanationImage: question.explanationImage,
  });
}
