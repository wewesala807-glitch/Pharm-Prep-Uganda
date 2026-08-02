"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FilterBarProps {
  subjects: { id: string; name: string }[];
  topics: { id: string; title: string; subjectId: string }[];
  years: number[];
}

export function FilterBar({ subjects, topics, years }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSubject = searchParams.get("subject") ?? "";
  const currentTopic = searchParams.get("topic") ?? "";
  const currentDifficulty = searchParams.get("difficulty") ?? "";
  const currentYear = searchParams.get("year") ?? "";
  const currentImage = searchParams.get("hasImage") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "subject") params.delete("topic");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const visibleTopics = currentSubject
    ? topics.filter((t) => t.subjectId === currentSubject)
    : topics;

  const selectClass =
    "h-10 rounded-2xl border border-border bg-white px-3 font-ui text-sm text-dark outline-none focus:border-primary";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className={selectClass}
        value={currentSubject}
        onChange={(e) => updateParam("subject", e.target.value)}
      >
        <option value="">All subjects</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={currentTopic}
        onChange={(e) => updateParam("topic", e.target.value)}
      >
        <option value="">All topics</option>
        {visibleTopics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={currentDifficulty}
        onChange={(e) => updateParam("difficulty", e.target.value)}
      >
        <option value="">All difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      <select
        className={selectClass}
        value={currentYear}
        onChange={(e) => updateParam("year", e.target.value)}
      >
        <option value="">All years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={currentImage}
        onChange={(e) => updateParam("hasImage", e.target.value)}
      >
        <option value="">Image or not</option>
        <option value="yes">Has image</option>
        <option value="no">No image</option>
      </select>
    </div>
  );
}
