"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function QuizPerformanceChart({
  data,
}: {
  data: { day: string; accuracy: number }[];
}) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Accuracy"]}
            contentStyle={{ borderRadius: 12, borderColor: "#E2E8F0", fontFamily: "var(--font-dm-sans)" }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#1A56DB"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#1A56DB" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
