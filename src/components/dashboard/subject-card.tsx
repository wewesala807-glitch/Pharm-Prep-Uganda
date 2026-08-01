import Link from "next/link";
import { Card } from "@/components/ui/card";

export function SubjectCard({
  slug,
  name,
  icon,
  color,
  progress,
}: {
  slug: string;
  name: string;
  icon: string;
  color: string;
  progress?: number;
}) {
  return (
    <Link href={`/subjects/${slug}`}>
      <Card className="h-full overflow-hidden" style={{ borderTopWidth: 4, borderTopColor: color }}>
        <div className="p-5">
          <div className="text-3xl">{icon}</div>
          <h3 className="mt-3 font-heading text-base font-semibold text-dark">{name}</h3>

          {progress !== undefined && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: color }}
                />
              </div>
              <span className="mt-1 block font-ui text-xs text-muted">{progress}% complete</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
