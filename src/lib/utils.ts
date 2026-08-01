import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUGX(amount: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Given a sorted-descending list of distinct activity dates (YYYY-MM-DD),
 * returns the current consecutive-day streak counting back from today.
 */
export function calculateStreak(activityDates: string[]): number {
  if (activityDates.length === 0) return 0;

  const unique = Array.from(new Set(activityDates)).sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  for (const dateStr of unique) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((cursor.getTime() - d.getTime()) / 86400000);

    if (diffDays === 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (diffDays === 1 && streak === 0) {
      // Allows streak to still show if today has no activity yet but yesterday did
      streak += 1;
      cursor = new Date(d);
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
