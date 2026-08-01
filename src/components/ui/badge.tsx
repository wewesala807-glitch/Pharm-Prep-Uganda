import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { HTMLAttributes } from "react";

const styles = {
  easy: "bg-easy/10 text-easy",
  medium: "bg-medium/10 text-medium",
  hard: "bg-hard/10 text-hard",
  premium: "bg-accentGold/10 text-accentGold",
  free: "bg-accentGreen/10 text-accentGreen",
  neutral: "bg-muted/10 text-muted",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof styles;
}

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-ui font-semibold",
        styles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function PremiumBadge() {
  return (
    <Badge tone="premium">
      <Lock className="h-3 w-3" /> Premium
    </Badge>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "EASY" | "MEDIUM" | "HARD" }) {
  const tone = difficulty.toLowerCase() as "easy" | "medium" | "hard";
  return <Badge tone={tone}>{difficulty}</Badge>;
}
