"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, ListChecks, Video, Users, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/notes", label: "Note editor", icon: FileText },
  { href: "/admin/questions", label: "Question editor", icon: ListChecks },
  { href: "/admin/videos", label: "Video manager", icon: Video },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-white">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="font-heading text-lg font-bold text-dark">
          Admin<span className="text-premium">.</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 font-ui text-sm font-medium transition-colors",
                active ? "bg-premium/10 text-premium" : "text-dark hover:bg-bg"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-2xl px-4 py-2.5 font-ui text-sm text-muted hover:bg-bg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to app
        </Link>
      </div>
    </aside>
  );
}
