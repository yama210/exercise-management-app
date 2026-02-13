// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 space-y-3">
      <h2 className="text-lg font-semibold">読み込み中にエラーが発生しました</h2>
      <p className="text-sm text-gray-500 break-all">
        {error.message || "Unknown error"}
        {error.digest ? ` (digest: ${error.digest})` : null}
      </p>
      <button
        onClick={reset}
        className="px-3 py-2 rounded bg-black text-white hover:opacity-90"
      >
        もう一度試す
      </button>
    </div>
  );
}
