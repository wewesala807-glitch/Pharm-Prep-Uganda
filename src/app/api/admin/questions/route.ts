import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    topicId,
    text,
    explanation,
    difficulty,
    examYear,
    isPremium,
    imageUrl,
    explanationImage,
    options,
  }: {
    topicId: string;
    text: string;
    explanation: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    examYear: number | null;
    isPremium: boolean;
    imageUrl: string | null;
    explanationImage: string | null;
    options: OptionInput[];
  } = body;

  if (!topicId || !text || !explanation || !Array.isArray(options) || options.length !== 4) {
    return NextResponse.json({ error: "Missing required fields or wrong number of options" }, { status: 400 });
  }
  if (!options.some((o) => o.isCorrect)) {
    return NextResponse.json({ error: "Mark one option as correct" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      topicId,
      text,
      explanation,
      difficulty,
      examYear,
      isPremium: !!isPremium,
      imageUrl,
      explanationImage,
      type: "MCQ",
      options: {
        create: options.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect, order: i })),
      },
    },
  });

  return NextResponse.json({ question });
}
