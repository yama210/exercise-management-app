// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="text-sm text-gray-500">URLが正しいかご確認ください。</p>
      <Link href="/" className="text-blue-600 underline">ホームに戻る</Link>
    </div>
  );
}
