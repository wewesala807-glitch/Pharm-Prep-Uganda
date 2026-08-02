import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, DifficultyBadge, PremiumBadge } from "@/components/ui/badge";

interface QuestionItem {
  id: string;
  text: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPremium: boolean;
  examYear: number | null;
}

export function QuestionsTab({
  topicId,
  questions,
}: {
  topicId: string;
  questions: QuestionItem[];
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-ui text-sm text-muted">{questions.length} questions in this topic</p>
        <Link href={`/quiz/practice/${topicId}`}>
          <Button size="sm">Practice this topic</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <Card key={q.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-ui text-sm text-dark">
                <span className="font-semibold text-muted">{i + 1}.</span> {q.text}
              </p>
              <div className="flex flex-shrink-0 gap-2">
                {q.isPremium && <PremiumBadge />}
                <DifficultyBadge difficulty={q.difficulty} />
              </div>
            </div>
            {q.examYear && (
              <Badge tone="neutral" className="mt-2">
                {q.examYear} exam
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
