"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is this platform recognized by the pharmacy board?",
    a: "PharmaPrep Uganda is an independent study platform. It is not affiliated with any licensing board — it's built to help you prepare thoroughly for the exam content itself.",
  },
  {
    q: "What exactly does the free plan include?",
    a: "One free topic per subject with full notes, all video lessons for every topic, and 5 free practice questions per topic. Enough to genuinely evaluate the platform before upgrading.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "MTN Mobile Money, Airtel Money, and card payments, all processed securely through Flutterwave.",
  },
  {
    q: "Can I study without internet?",
    a: "Yes. Any note or question set you've already opened once is cached for offline access, with a banner letting you know you're viewing saved content.",
  },
  {
    q: "How similar are the mock exams to the real thing?",
    a: "Mock exams run 100 questions on a 3-hour timer, matching the real exam's format and pacing, with no feedback until you submit.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-bg py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-dark md:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Card key={item.q} className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="tap-target flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-ui font-semibold text-dark">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 font-ui text-sm text-muted">{item.a}</div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
