import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Params = { params: { id: string } };

type Category = {
  id: string;
  name: string;
};

export default async function EditGadgetPage({ params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/auth/login");

  const gadget = await prisma.gadget.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      category: true,
    },
  });

  const categories: Category[] = await prisma.category.findMany();

  if (!gadget) {
    return (
      <p className="text-center text-red-500 mt-8">
        Gadget tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        action={`/api/gadget/${gadget.id}`}
        method="POST"
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Gadget</h1>

        <input
          type="text"
          name="name"
          defaultValue={gadget.name}
          placeholder="Nama Gadget"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="image"
          defaultValue={gadget.image}
          placeholder="URL Gambar"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          defaultValue={gadget.price}
          placeholder="Harga"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <select
          name="status"
          defaultValue={gadget.status}
          className="w-full border px-3 py-2 rounded bg-white"
        >
          <option value="WISHLIST">Wishlist</option>
          <option value="BOUGHT">Dibeli</option>
          <option value="PENDING">Menunggu</option>
        </select>

        <select
          name="categoryId"
          defaultValue={gadget.categoryId}
          className="w-full border px-3 py-2 rounded bg-white"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input type="hidden" name="_method" value="PUT" />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
