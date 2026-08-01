"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 font-ui text-xs font-semibold text-muted"
          >
            Built for Ugandan pharmacy graduates
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-heading text-6xl font-bold leading-none text-dark md:text-8xl"
          >
            PSU<span className="text-primary">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-md font-ui text-lg text-muted"
          >
            Pharmacy Sitting Ready — Uganda&apos;s question bank, video lessons, and mock exams
            built to get you through the pre-licensure and post-internship exams on your first
            attempt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="/register">
              <Button size="lg">Start studying free</Button>
            </a>
            <a href="#features">
              <Button size="lg" variant="outline">
                See what&apos;s inside
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Signature element: a capsule split into Uganda green/gold halves, filling like a progress bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto flex h-64 w-64 items-center justify-center md:h-80 md:w-80"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-accentGold/10" />
          <div className="relative h-40 w-72 -rotate-12 overflow-hidden rounded-full border-4 border-white shadow-card-hover md:h-52 md:w-96">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-accentGreen" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-accentGold" />
            <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
