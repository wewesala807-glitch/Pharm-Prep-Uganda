"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

function AnimatedStat({ value, suffix = "", label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
  }, [spring, suffix]);

  return (
    <div className="text-center">
      <div ref={ref} className="font-heading text-4xl font-bold text-primary md:text-5xl">
        0{suffix}
      </div>
      <div className="mt-2 font-ui text-sm text-muted">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border bg-bg py-14">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4"
      >
        <AnimatedStat value={4800} suffix="+" label="Students studying" />
        <AnimatedStat value={3600} suffix="+" label="Practice questions" />
        <AnimatedStat value={432} label="Video lessons" />
        <AnimatedStat value={91} suffix="%" label="First-attempt pass rate" />
      </motion.div>
    </section>
  );
}
