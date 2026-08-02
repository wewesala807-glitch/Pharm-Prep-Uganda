import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  newPassword: z.string().min(8).optional().or(z.literal("")),
  currentPassword: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { name, email, newPassword, currentPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const data: { name: string; email: string; hashedPassword?: string } = { name, email };

  if (newPassword) {
    if (!user.hashedPassword) {
      return NextResponse.json(
        { error: "This account uses Google sign-in and has no password to change." },
        { status: 400 }
      );
    }
    const valid = currentPassword && (await bcrypt.compare(currentPassword, user.hashedPassword));
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    data.hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({ where: { id: session.user.id }, data });

  return NextResponse.json({ success: true });
}
