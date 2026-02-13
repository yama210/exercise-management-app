"use client";

import Link from "next/link";
import type { Record as AppRecord } from "@/lib/types";
import { getExerciseLabel } from "@/lib/types";
import DeleteRecordForm from "./DeleteRecordForm";


export default function RecordsList({ items }: { items: AppRecord[] }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const parseLocalDate = (dateStr: string) => new Date(`${dateStr}T00:00:00`);
  const formatDisplayDate = (dateStr: string) => {
    const d = parseLocalDate(dateStr);
    return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} (${weekdays[d.getDay()]})`;
  };

  if (items.length === 0) return <p>この週の記録はありません</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 mt-6">この週の記録</h2>
      <ul className="space-y-4 mb-8">
        {items.map((r) => (
          <li key={r.id} className="p-2 border rounded">
            <div className="flex items-center justify-between">
              <span>{formatDisplayDate(r.date)} - 合計 {r.totalCalories} kcal</span>
              <div className="space-x-2">
                <Link href={`/${r.id}/edit`} className="px-3 py-1 bg-green-500 text-white rounded">
                  編集
                </Link>
                <DeleteRecordForm id={r.id} />
              </div>
            </div>

            <ul className="ml-4 list-disc">
              {r.exercises.map((ex, idx) => (
                <li key={idx}>
                  {getExerciseLabel(ex.exercise)} - {ex.minutes}分 - {ex.calories}kcal
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
