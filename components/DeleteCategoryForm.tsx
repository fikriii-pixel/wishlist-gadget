"use client";

import { useRouter } from "next/navigation";

export default function DeleteCategoryForm({ categoryId }: { categoryId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus kategori ini?");
    if (!confirmDelete) return;

    await fetch(`/api/category/${categoryId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _method: "DELETE" }),
    });

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 text-sm hover:underline"
    >
      Hapus
    </button>
  );
}
