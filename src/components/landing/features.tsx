"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookOpenText,
  Video,
  ListChecks,
  Timer,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: BookOpenText,
    title: "Syllabus-mapped notes",
    description:
      "Concise notes across all 12 pharmacy subjects, written to match what examiners actually test.",
  },
  {
    icon: Video,
    title: "Bite-sized video lessons",
    description: "Short video walkthroughs for every topic, playable inline without leaving the page.",
  },
  {
    icon: ListChecks,
    title: "3,600+ practice questions",
    description: "Past-paper-style MCQs with full explanations, tagged by subject, topic, and difficulty.",
  },
  {
    icon: Timer,
    title: "Full mock exams",
    description: "100-question, 3-hour timed simulations that mirror the real licensing exam format.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    description: "See your accuracy by subject, your study streak, and exactly where you're falling behind.",
  },
  {
    icon: ShieldCheck,
    title: "Study offline",
    description: "Notes and questions you've already opened stay available even without data.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-3 font-ui text-muted">
            Built around how the licensing exam is actually structured, not a generic study app.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <f.icon className="h-6 w-6" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-heading text-lg font-semibold text-dark">{f.title}</h3>
                  <p className="mt-2 font-ui text-sm text-muted">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
