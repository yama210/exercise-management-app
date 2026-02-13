"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exercises as masterExercises } from "@/lib/types";
import {
  dbInsertRecord,
  dbUpdateRecord,
  dbDeleteRecord,
  type ExerciseRowInput,
} from "@/lib/database";

function getFactor(value: string) {
  const hit = masterExercises.find((e) => e.value === value);
  if (!hit) throw new Error(`Unknown exercise type: ${value}`);
  return hit.factor;
}

export async function addRecord(formData: FormData) {
  const date = formData.get("date") as string;
  const exerciseList = formData.getAll("exercise") as string[];
  const minutesList  = formData.getAll("minutes")  as string[];

  const rows: ExerciseRowInput[] = exerciseList.map((exercise, i) => {
    const minutes = Number(minutesList[i]);
    const calories = minutes * getFactor(exercise);
    return { exercise, minutes, calories };
  });
  const total = rows.reduce((s, r) => s + r.calories, 0);

  await dbInsertRecord({ date, totalCalories: total, exercises: rows });
  revalidatePath("/");
  redirect("/");
}

export async function updateRecord(id: number, formData: FormData) {
  const date = formData.get("date") as string;
  const exerciseList = formData.getAll("exercise") as string[];
  const minutesList  = formData.getAll("minutes")  as string[];

  const rows: ExerciseRowInput[] = exerciseList.map((exercise, i) => {
    const minutes = Number(minutesList[i]);
    const calories = minutes * getFactor(exercise);
    return { exercise, minutes, calories };
  });
  const total = rows.reduce((s, r) => s + r.calories, 0);

  await dbUpdateRecord(id, { date, totalCalories: total, exercises: rows });
  revalidatePath("/");
  redirect("/");
}

export async function deleteRecord(id: number) {
  await dbDeleteRecord(id);
  revalidatePath("/");
  redirect("/"); 
}
