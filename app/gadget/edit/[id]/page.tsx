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

  if (!gadget) return <p className="text-center text-red-500">Gadget tidak ditemukan.</p>;

  return (
    <form
      action={`/api/gadget/${gadget.id}`}
      method="POST"
      className="max-w-xl mx-auto p-6 space-y-4"
    >
      <h1 className="text-xl font-bold mb-4">Edit Gadget</h1>

      <input
        type="text"
        name="name"
        defaultValue={gadget.name}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        name="image"
        defaultValue={gadget.image}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="number"
        name="price"
        defaultValue={gadget.price}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <select
        name="status"
        defaultValue={gadget.status}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="WISHLIST">WISHLIST</option>
        <option value="BOUGHT">BOUGHT</option>
        <option value="PENDING">PENDING</option>
      </select>

      <select
        name="categoryId"
        defaultValue={gadget.categoryId}
        className="w-full border px-3 py-2 rounded"
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
        className="w-full bg-blue-600 text-white py-2 px-4 rounded"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
