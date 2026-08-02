import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topicId, title, description, youtubeId, order } = await req.json();
  if (!topicId || !title || !youtubeId) {
    return NextResponse.json({ error: "topicId, title, and youtubeId are required" }, { status: 400 });
  }

  const video = await prisma.video.create({
    data: {
      topicId,
      title,
      description: description ?? "",
      youtubeId,
      duration: 0,
      order: order ?? 0,
      isPremium: false, // videos are always free per spec
    },
  });

  return NextResponse.json({ video });
}
