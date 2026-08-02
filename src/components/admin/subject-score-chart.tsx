"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function AdminSubjectScoreChart({ data }: { data: { subject: string; percent: number }[] }) {
  return (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} />
          <YAxis type="category" dataKey="subject" width={140} tick={{ fontSize: 11, fill: "#0F172A" }} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Avg score"]} />
          <Bar dataKey="percent" fill="#7C3AED" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
