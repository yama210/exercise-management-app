import { NextResponse } from "next/server";
import { dbGetAllRecords } from "@/lib/database";

export async function GET() {
  const records = await dbGetAllRecords();
  return NextResponse.json({
    baseYmd: todayYmdInJST(),
    records,
  });
}

function todayYmdInJST(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const jstMs = utcMs + 9 * 60 * 60_000;
  const jst = new Date(jstMs);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // "YYYY-MM-DD"
}
