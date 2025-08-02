"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <select
      defaultValue={searchParams.get("category") || "all"}
      onChange={handleChange}
      className="border px-3 py-2 rounded"
    >
      <option value="all">Semua Kategori</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
