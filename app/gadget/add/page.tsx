"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
};

export default function AddGadgetPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    status: "WISHLIST",
    categoryId: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  // Ambil kategori dari API
  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  // Handler form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kirim form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/gadget", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Gagal menambahkan gadget");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Gadget</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <Input
          name="name"
          placeholder="Nama Gadget"
          onChange={handleChange}
          required
        />
        <Input
          name="image"
          placeholder="URL Gambar"
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          type="number"
          placeholder="Harga"
          onChange={handleChange}
          required
        />

        <select
          name="status"
          onChange={handleChange}
          value={form.status}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="WISHLIST">WISHLIST</option>
          <option value="BOUGHT">BOUGHT</option>
          <option value="PENDING">PENDING</option>
        </select>

        <select
          name="categoryId"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Button type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </div>
  );
}
