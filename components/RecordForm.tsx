"use client";

import { useState } from "react";
import ExerciseRow from "./ExerciseRow";

type Row = { exercise: string; minutes: number };

type Props = {
  title: string;                               // 見出し
  submitLabel?: string;                        // ボタン文言
  initialDate?: string;                        // "YYYY-MM-DD"
  initialRows?: Row[];                         // 行の初期値
  action: (formData: FormData) => void;     // Server Action（add or update）
};

export default function RecordForm({
  title,
  submitLabel = "保存",
  initialDate,
  initialRows,
  action,
}: Props) {
  const [rows, setRows] = useState<Row[]>(
    initialRows && initialRows.length > 0
      ? initialRows
      : [{ exercise: "walking", minutes: 10 }]
  );

  const addRow = () => setRows((r) => [...r, { exercise: "walking", minutes: 10 }]);
  const removeRow = (idx: number) => setRows((r) => r.filter((_, i) => i !== idx));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{title}</h1>

      <form action={action} className="space-y-4">
        <div>
          <label className="block">日付</label>
          <input
            type="date"
            name="date"
            defaultValue={initialDate}
            required
            className="border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-2">運動内容</label>
          {rows.map((row, idx) => (
            <ExerciseRow
              key={idx}
              index={idx}
              exercise={row.exercise}
              minutes={row.minutes}
              removable={rows.length > 1}
              onRemove={() => removeRow(idx)}
            />
          ))}

          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1 bg-blue-500 text-white rounded mt-2"
          >
            運動を追加
          </button>
        </div>

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
