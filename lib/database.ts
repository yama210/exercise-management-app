import { Pool, QueryResultRow } from "pg";
import { z } from "zod";
import type { Record as RecordType } from "@/lib/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type DbParam = string | number | boolean | null | Date;

type JoinedRecordRow = QueryResultRow & {
  id: number;
  date: string | Date;
  total_calories: number;
  exercise_id: number | null;
  exercise_type: string | null;
  minutes: number | null;
  calories: number | null;
};

function errorMessageWithCode(e: unknown, fallback: string): string {
  if (typeof e === "object" && e !== null) {
    const msg = "message" in e && typeof e.message === "string" ? e.message : fallback;
    const code = "code" in e && typeof e.code === "string" ? ` [code=${e.code}]` : "";
    return `${msg}${code}`;
  }
  return fallback;
}

async function q<T extends QueryResultRow = QueryResultRow>(sql: string, params?: DbParam[]) {
  try {
    const res = await pool.query<T>(sql, params);
    return res;
  } catch (e: unknown) {
    throw new Error(errorMessageWithCode(e, "Database error"));
  }
}
async function getClient() {
  try {
    return await pool.connect();
  } catch (e: unknown) {
    throw new Error(errorMessageWithCode(e, "Failed to get DB client"));
  }
}

const YmdSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(s + "T00:00:00Z");
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, "Invalid date");

const ExerciseRowSchema = z.object({
  exercise: z.string().min(1),
  minutes: z.number().int().nonnegative(),
  calories: z.number().int().nonnegative(),
});

const NewRecordSchema = z.object({
  date: YmdSchema,
  totalCalories: z.number().int().nonnegative(),
  exercises: z.array(ExerciseRowSchema),
});

const UpdateRecordSchema = NewRecordSchema;

const IdSchema = z.number().int().positive();

/**  型（DB入出力向け） */
export type ExerciseRowInput = {
  exercise: string;
  minutes: number;
  calories: number;
};

export type NewRecordInput = {
  date: string;
  totalCalories: number;
  exercises: ExerciseRowInput[];
};

export type UpdateRecordInput = NewRecordInput;

function toYMD(d: Date | string): string {
  if (d instanceof Date) {
    const iso = d.toISOString().slice(0, 10);
    YmdSchema.parse(iso);
    return iso;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    YmdSchema.parse(d);
    return d;
  }
  const dd = new Date(d);
  if (isNaN(dd.getTime())) throw new Error("Invalid date");
  const iso = dd.toISOString().slice(0, 10);
  YmdSchema.parse(iso);
  return iso;
}

export async function dbGetAllRecords(): Promise<RecordType[]> {
  const sql = `
    SELECT 
      r.id,
      r.date,
      r.total_calories,
      e.id   AS exercise_id,
      e.type AS exercise_type,
      e.minutes,
      e.calories
    FROM records r
    LEFT JOIN exercises e ON e.record_id = r.id
    ORDER BY r.date ASC, r.id ASC, e.id ASC;
  `;
  const { rows } = await q<JoinedRecordRow>(sql);

  const map = new Map<number, RecordType>();
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        date: toYMD(row.date),
        totalCalories: Number(row.total_calories),
        exercises: [],
      });
    }
    if (row.exercise_id) {
      map.get(row.id)!.exercises.push({
        exercise: String(row.exercise_type),
        minutes: Number(row.minutes),
        calories: Number(row.calories),
      });
    }
  }
  return Array.from(map.values());
}

export async function dbGetRecordById(id: number): Promise<RecordType | null> {
  IdSchema.parse(id);

  const sql = `
    SELECT 
      r.id,
      r.date,
      r.total_calories,
      e.id   AS exercise_id,
      e.type AS exercise_type,
      e.minutes,
      e.calories
    FROM records r
    LEFT JOIN exercises e ON e.record_id = r.id
    WHERE r.id = $1
    ORDER BY e.id ASC;
  `;
  const { rows } = await q<JoinedRecordRow>(sql, [id]);
  if (rows.length === 0) return null;

  const rec: RecordType = {
    id: rows[0].id,
    date: toYMD(rows[0].date),
    totalCalories: Number(rows[0].total_calories),
    exercises: [],
  };

  for (const row of rows) {
    if (row.exercise_id) {
      rec.exercises.push({
        exercise: String(row.exercise_type),
        minutes: Number(row.minutes),
        calories: Number(row.calories),
      });
    }
  }
  return rec;
}

export async function dbInsertRecord(input: NewRecordInput): Promise<number> {
  const parsed = NewRecordSchema.parse(input);

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const recRes = await client.query<{ id: number }>(
      `INSERT INTO records (date, total_calories) VALUES ($1, $2) RETURNING id;`,
      [parsed.date, parsed.totalCalories]
    );
    const recordId = recRes.rows[0].id;

    if (parsed.exercises.length > 0) {
      const vals: DbParam[] = [];
      const ph: string[] = [];
      parsed.exercises.forEach((ex, i) => {
        const b = i * 4;
        ph.push(`($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4})`);
        vals.push(recordId, ex.exercise, ex.minutes, ex.calories);
      });
      await client.query(
        `INSERT INTO exercises (record_id, type, minutes, calories) VALUES ${ph.join(",")};`,
        vals
      );
    }

    await client.query("COMMIT");
    return recordId;
  } catch (e: unknown) {
    await client.query("ROLLBACK");
    throw new Error(errorMessageWithCode(e, "Insert failed"));
  } finally {
    client.release();
  }
}

export async function dbUpdateRecord(id: number, input: UpdateRecordInput): Promise<void> {
  IdSchema.parse(id);
  const parsed = UpdateRecordSchema.parse(input);

  const client = await getClient();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE records SET date = $1, total_calories = $2 WHERE id = $3;`,
      [parsed.date, parsed.totalCalories, id]
    );

    await client.query(`DELETE FROM exercises WHERE record_id = $1;`, [id]);

    if (parsed.exercises.length > 0) {
      const vals: DbParam[] = [];
      const ph: string[] = [];
      parsed.exercises.forEach((ex, i) => {
        const b = i * 4;
        ph.push(`($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4})`);
        vals.push(id, ex.exercise, ex.minutes, ex.calories);
      });
      await client.query(
        `INSERT INTO exercises (record_id, type, minutes, calories) VALUES ${ph.join(",")};`,
        vals
      );
    }

    await client.query("COMMIT");
  } catch (e: unknown) {
    await client.query("ROLLBACK");
    throw new Error(errorMessageWithCode(e, "Update failed"));
  } finally {
    client.release();
  }
}

export async function dbDeleteRecord(id: number): Promise<void> {
  IdSchema.parse(id);
  await q(`DELETE FROM exercises WHERE record_id = $1;`, [id]);
  const { rowCount } = await q(`DELETE FROM records WHERE id = $1;`, [id]);
  if (rowCount === 0) throw new Error("Record not found");
}
