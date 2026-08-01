"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ListChecks, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/questions", label: "Questions", icon: ListChecks },
  { href: "/settings", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-white md:hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "tap-target flex flex-1 flex-col items-center justify-center gap-0.5 py-2 font-ui text-[11px] font-medium",
              active ? "text-primary" : "text-muted"
            )}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
