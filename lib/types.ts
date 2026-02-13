/** 1つの運動内容 */
export interface ExerciseRecord {
  exercise: string;   
  minutes: number;    
}

/** 1日の記録 */
export interface Record {
  id: number;
  date: string;
  exercises: (ExerciseRecord & { calories: number })[]; 
  totalCalories: number;       
}

export interface Exercise {
  label: string;   
  value: string;   
  factor: number;  
}

/** アプリで使う運動一覧 */
export const exercises: Exercise[] = [
  { label: "ウォーキング", value: "walking", factor: 4 },
  { label: "ジョギング", value: "jogging", factor: 8 },
  { label: "サイクリング", value: "cycling", factor: 6 },
  { label: "筋トレ", value: "strength", factor: 5 },
  { label: "ヨガ", value: "yoga", factor: 3 },
];

export function getExerciseLabel(value: string): string {
  const ex = exercises.find((e) => e.value === value);
  return ex ? ex.label : value;
}

