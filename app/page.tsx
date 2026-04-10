import HomeClient from "@/components/HomeClient";
import { dbGetAllRecords } from "@/lib/database";

function todayYmdInJST(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const jstMs = utcMs + 9 * 60 * 60_000;
  const jst = new Date(jstMs);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function Home() {
  const records = await dbGetAllRecords();
  const baseYmd = todayYmdInJST();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">ホーム</h1>
        <p className="mt-1 text-sm text-gray-600">
          週ごとの運動記録を確認できます（初期表示＝今週／月〜日）。
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-0 shadow-sm">
        <HomeClient initialRecords={records} baseYmd={baseYmd} />
      </section>
    </div>
  );
}
