import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DeleteCategoryForm from "@/components/DeleteCategoryForm";

// Tipe kategori
type Category = {
  id: string;
  name: string;
};

export default async function CategoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <p className="text-center text-red-500 mt-8">
        Kamu harus login untuk mengakses halaman ini.
      </p>
    );
  }

  const categories: Category[] = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h1>
          <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
            ⬅ Kembali ke Dashboard
          </Link>
        </div>

        {/* Form tambah kategori */}
        <form action="/api/category" method="POST" className="flex gap-2 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Nama Kategori"
            className="flex-1 border px-3 py-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Tambah
          </button>
        </form>

        {/* Tabel kategori */}
        {categories.length === 0 ? (
          <p className="text-gray-600">Belum ada kategori.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left w-48">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2 space-y-1">
                    {/* Form edit */}
                    <form
                      action={`/api/category/${cat.id}`}
                      method="POST"
                      className="flex gap-2 mb-1"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Ubah nama"
                        required
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <input type="hidden" name="_method" value="PUT" />
                      <button
                        type="submit"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Simpan
                      </button>
                    </form>

                    {/* Tombol hapus dari komponen client */}
                    <DeleteCategoryForm categoryId={cat.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
