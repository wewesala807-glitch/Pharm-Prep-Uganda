import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PremiumBadge } from "@/components/ui/badge";

export function NoteCard({
  title,
  content,
  isPremium,
  isLocked,
}: {
  title: string;
  content: string;
  isPremium: boolean;
  isLocked: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-dark">{title}</h3>
        {isPremium && <PremiumBadge />}
      </div>

      <div className="relative">
        <div
          className={`note-content ${isLocked ? "pointer-events-none max-h-40 overflow-hidden blur-sm select-none" : ""}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-white via-white/90 to-transparent">
            <Lock className="h-8 w-8 text-accentGold" />
            <p className="font-ui text-sm font-medium text-dark">This note is for Premium students</p>
            <Link href="/settings?upgrade=1">
              <Button variant="premium" size="sm">
                Upgrade to unlock
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
