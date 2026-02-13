"use client";

import { useState } from "react";
import type { Record as AppRecord } from "@/lib/types";
import { useWeeklyData } from "./useWeeklyData";
import WeekNavigator from "./WeekNavigator";
import WeeklyChart from "./WeeklyChart";
import RecordsList from "./RecordsList";

export default function HomeClient({
  initialRecords,
  baseYmd,
}: {
  initialRecords: AppRecord[];
  baseYmd: string; 
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { weekRange, chartData, weekRecords } =
    useWeeklyData({ allRecords: initialRecords, weekOffset, baseYmd });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">運動記録（週表示）</h1>
      <WeekNavigator
        weekRange={weekRange}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />
      <div className="mt-4">
        <WeeklyChart data={chartData} />
      </div>
      <div className="mt-6">
        <RecordsList items={weekRecords} />
      </div>
    </div>
  );
}
