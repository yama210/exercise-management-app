"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyChart({ data }: { data: { label: string; total: number }[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">カロリー消費グラフ</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#82ca9d"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
