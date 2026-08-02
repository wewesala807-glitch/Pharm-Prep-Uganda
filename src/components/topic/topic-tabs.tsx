"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopicTabsProps {
  notes: React.ReactNode;
  videos: React.ReactNode;
  questions: React.ReactNode;
}

const TABS = ["Notes", "Videos", "Questions"] as const;

export function TopicTabs({ notes, videos, questions }: TopicTabsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Notes");

  const content = { Notes: notes, Videos: videos, Questions: questions }[active];

  return (
    <div>
      <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "tap-target flex-shrink-0 border-b-2 px-4 py-3 font-ui text-sm font-semibold transition-colors",
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-dark"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">{content}</div>
    </div>
  );
}
