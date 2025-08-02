import prisma from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ Tipe untuk kategori
type Category = {
  id: string;
  name: string;
};

export default async function CategoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <p className="text-center text-red-500">
        Kamu harus login untuk mengakses halaman ini.
      </p>
    );
  }

  const categories: Category[] = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Kategori</h1>

      {/* Form tambah kategori */}
      <form action="/api/category" method="POST" className="flex gap-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Nama Kategori"
          className="flex-1 border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </form>

      {/* Tabel kategori */}
      {categories.length === 0 ? (
        <p className="text-gray-600">Belum ada kategori.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-2">{cat.name}</td>
                <td className="p-2 space-x-2">
                  {/* Form edit nama */}
                  <form
                    action={`/api/category/${cat.id}`}
                    method="POST"
                    className="inline-block"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Ubah nama"
                      required
                      className="px-2 py-1 border rounded"
                    />
                    <input type="hidden" name="_method" value="PUT" />
                    <button type="submit" className="text-blue-600 text-sm ml-1">
                      Simpan
                    </button>
                  </form>

                  {/* Form hapus */}
                  <form
                    action={`/api/category/${cat.id}`}
                    method="POST"
                    onSubmit={(e) => {
                      if (!confirm("Yakin ingin menghapus kategori ini?")) e.preventDefault();
                    }}
                    className="inline-block"
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="text-red-600 text-sm">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
