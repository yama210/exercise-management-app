"use client";

import { exercises } from "@/lib/types";

type Props = {
  index: number;
  exercise: string;
  minutes: number;
  removable: boolean;
  onRemove: () => void;
};

export default function ExerciseRow({
  index,
  exercise,
  minutes,
  removable,
  onRemove,
}: Props) {
  return (
    <div className="flex space-x-2 mb-2 items-center">
      <select
        name="exercise"
        defaultValue={exercise}
        className="border px-2 py-1 rounded"
        aria-label={`運動${index + 1}`}
      >
        {exercises.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="minutes"
        defaultValue={minutes}
        min={1}
        required
        className="border px-2 py-1 rounded w-24"
        aria-label={`分数${index + 1}`}
      />
      <span className="self-center">分</span>

      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          削除
        </button>
      )}
    </div>
  );
}
