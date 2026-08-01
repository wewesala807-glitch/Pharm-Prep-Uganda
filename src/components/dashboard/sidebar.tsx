"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  BarChart3,
  Bookmark,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/questions", label: "Question Bank", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-white md:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="font-heading text-lg font-bold text-dark">
          Pharma<span className="text-primary">Prep</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 font-ui text-sm font-medium transition-colors",
                active ? "bg-primary/10 text-primary" : "text-dark hover:bg-bg"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-2.5 font-ui text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-premium/10 text-premium"
                : "text-premium hover:bg-premium/5"
            )}
          >
            <ShieldCheck className="h-5 w-5" />
            Admin panel
          </Link>
        )}
      </nav>
    </aside>
  );
}
