"use client";

import type { Record as AppRecord } from "@/lib/types";

const W = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const z = (n: number) => String(n).padStart(2, "0");

// "YYYY-MM-DD" をローカル00:00で解釈（UTC化しない）
const parseLocalYmd = (s: string) => new Date(`${s}T00:00:00`);

// ローカル Date → "YYYY-MM-DD"
const ymd = (d: Date) =>
  `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;

// ラベル "M/D (Wk)"
const label = (s: string) => {
  const d = parseLocalYmd(s);
  return `${d.getMonth() + 1}/${d.getDate()} (${W[d.getDay()]})`;
};

// 週頭（月曜）
const startOfWeekMonday = (base: Date, off = 0) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();         // 0..6 (Sun..Sat)
  const diff = (dow + 6) % 7;     // 月曜まで戻る距離
  d.setDate(d.getDate() - diff + off * 7);
  return d;
};

// "YYYY/MM/DD 〜 YYYY/MM/DD"
const periodText = (a: Date, b: Date) =>
  `${a.getFullYear()}/${z(a.getMonth() + 1)}/${z(a.getDate())} 〜 ${b.getFullYear()}/${z(b.getMonth() + 1)}/${z(b.getDate())}`;

export function useWeeklyData({
  allRecords,
  weekOffset,
  baseYmd,
}: {
  allRecords: AppRecord[];
  weekOffset: number;
  /** サーバ側で作った JST の "YYYY-MM-DD" */
  baseYmd: string;
}) {
  const anchor = parseLocalYmd(baseYmd);

  const monday = startOfWeekMonday(anchor, weekOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekRange = periodText(monday, sunday);

  // 日付ごと合計（キーは "YYYY-MM-DD" 統一）
  const totals: Record<string, number> = {};
  for (const r of allRecords) totals[r.date] = (totals[r.date] ?? 0) + r.totalCalories;

  // 月→日（欠損は0埋め）
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = ymd(d);
    return { label: label(key), total: totals[key] ?? 0 };
  });

  // 今週の一覧（降順）
  const weekRecords = allRecords
    .filter((r) => {
      const t = parseLocalYmd(r.date).getTime();
      return t >= monday.getTime() && t <= sunday.getTime();
    })
    .sort(
      (a, b) =>
        parseLocalYmd(b.date).getTime() - parseLocalYmd(a.date).getTime()
    );

  return { weekRange, chartData, weekRecords };
}
