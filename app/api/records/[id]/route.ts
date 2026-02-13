import { NextResponse } from "next/server";
import { dbGetRecordById } from "@/lib/database";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteCtx) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const rec = await dbGetRecordById(num);
  if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rec);
}
