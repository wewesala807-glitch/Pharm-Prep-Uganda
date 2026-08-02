import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topicId, title, content, isPremium } = await req.json();
  if (!topicId || !title || !content) {
    return NextResponse.json({ error: "topicId, title, and content are required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: { topicId, title, content, isPremium: !!isPremium },
  });

  return NextResponse.json({ note });
}
