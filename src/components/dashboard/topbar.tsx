"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  BarChart3,
  Bookmark,
  Settings,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/questions", label: "Question Bank", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Topbar({
  userName,
  isAdmin,
}: {
  userName: string;
  isAdmin?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur md:pl-64">
        <button
          className="tap-target rounded-2xl p-2 text-dark md:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="font-heading text-lg font-bold text-dark md:hidden">
          Pharma<span className="text-primary">Prep</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-ui text-sm text-muted md:inline">Hi, {userName.split(" ")[0]}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="tap-target flex items-center gap-1.5 rounded-2xl px-3 py-2 font-ui text-sm text-muted hover:bg-bg"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-4 shadow-card-hover md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-dark">Menu</span>
                <button
                  className="tap-target rounded-2xl p-2"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "tap-target flex items-center gap-3 rounded-2xl px-4 py-2.5 font-ui text-sm font-medium",
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
                    onClick={() => setDrawerOpen(false)}
                    className="tap-target flex items-center gap-3 rounded-2xl px-4 py-2.5 font-ui text-sm font-medium text-premium hover:bg-premium/5"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Admin panel
                  </Link>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
