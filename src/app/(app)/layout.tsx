import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { MobileBottomNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isAdmin={isAdmin} />
      <Topbar userName={session.user.name ?? "Student"} isAdmin={isAdmin} />
      <main className="pb-20 pt-6 md:pb-10 md:pl-60">
        <div className="mx-auto max-w-6xl px-4">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
