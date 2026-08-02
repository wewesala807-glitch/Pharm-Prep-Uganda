import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  if (plan !== "FREE" && plan !== "PREMIUM") {
    return NextResponse.json({ error: "plan must be FREE or PREMIUM" }, { status: 400 });
  }

  const planExpiresAt =
    plan === "PREMIUM" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: { plan, planExpiresAt },
  });

  return NextResponse.json({ user });
}
