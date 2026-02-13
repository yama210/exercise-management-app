// app/page.tsx
import HomeClient from "@/components/HomeClient";
import { getBaseUrl } from "@/lib/base-url";

export default async function Home() {
  const res = await fetch(`${getBaseUrl()}/api/records`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch records");
  const { records, baseYmd } = await res.json();

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
