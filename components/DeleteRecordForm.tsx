"use client";

import { deleteRecord } from "@/lib/actions";

export default function DeleteRecordForm({ id }: { id: number }) {
  return (
    <form action={deleteRecord.bind(null, id)} className="inline">
      <button type="submit" className="px-3 py-1 bg-red-500 text-white rounded">
        削除
      </button>
    </form>
  );
}

