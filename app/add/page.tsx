import RecordForm from "@/components/RecordForm";
import { addRecord } from "@/lib/actions";

export default function Add() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">新規記録を追加</h1>
        <p className="mt-1 text-sm text-gray-600">
          日付と運動内容・時間を入力して保存します。入力は後から編集できます。
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <RecordForm
          title="記録を追加"
          submitLabel="保存"
          initialDate={undefined}
          initialRows={undefined}
          action={addRecord}
        />
      </section>
    </div>
  );
}
