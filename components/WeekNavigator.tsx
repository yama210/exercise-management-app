"use client";

type Props = {
  weekRange: string;
  weekOffset: number;
  setWeekOffset: (n: number) => void;
};

export default function WeekNavigator({ weekRange, weekOffset, setWeekOffset }: Props) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={() => setWeekOffset(weekOffset - 1)}
        className="px-3 py-1 bg-gray-200 rounded text-gray-600"
      >
        ◀ 前の週
      </button>
      <span className="font-semibold">{weekRange}</span>
      {weekOffset < 0 && (
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="px-3 py-1 bg-gray-200 rounded text-gray-600"
        >
          次の週 ▶
        </button>
      )}
    </div>
  );
}
