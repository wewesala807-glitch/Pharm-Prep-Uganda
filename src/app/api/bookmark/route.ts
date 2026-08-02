import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionId } = await req.json();
  if (!questionId) return NextResponse.json({ error: "questionId is required" }, { status: 400 });

  const existing = await prisma.bookmark.findFirst({
    where: { userId: session.user.id, questionId },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: session.user.id, questionId },
  });
  return NextResponse.json({ bookmarked: true });
}
