// app/[id]/page.tsx
import { notFound } from "next/navigation";
import RecordForm from "@/components/RecordForm";
import { updateRecord } from "@/lib/actions";
import { getBaseUrl } from "@/lib/base-url";
import type { Record as AppRecord } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function Edit({ params }: Props) {
  const { id } = await params;
  const res = await fetch(`${getBaseUrl()}/api/records/${id}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to fetch record");

  const rec: AppRecord = await res.json();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">記録を編集</h1>
        <p className="mt-1 text-sm text-gray-600">内容を修正して「更新」を押してください。</p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <RecordForm
          title="記録を編集"
          submitLabel="更新"
          initialDate={rec.date}
          initialRows={rec.exercises.map((ex) => ({ exercise: ex.exercise, minutes: ex.minutes }))}
          action={updateRecord.bind(null, rec.id)}
        />
      </section>
    </div>
  );
}
