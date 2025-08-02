import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

type GadgetWithCategory = {
  id: string;
  name: string;
  image: string;
  price: number;
  status: string;
  category: { name: string };
};

type Category = {
  id: string;
  name: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/auth/login");

  const selectedCategory = searchParams?.category || "all";

  const categories: Category[] = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const gadgets: GadgetWithCategory[] = await prisma.gadget.findMany({
    where: {
      userId: session.user.id,
      ...(selectedCategory !== "all" && { categoryId: selectedCategory }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Halo, {session.user.name} 👋</h1>

      {/* Filter Kategori */}
      <form method="GET" className="mb-6">
        <select
          name="category"
          defaultValue={selectedCategory}
          onChange={(e) => e.currentTarget.form?.submit()}
          className="border px-3 py-2 rounded"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </form>

      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/gadget/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Gadget
        </Link>
        <Link href="/api/auth/signout" className="text-sm text-gray-600 hover:underline">
          Logout
        </Link>
      </div>

      {gadgets.length === 0 ? (
        <p className="text-gray-600">Tidak ada gadget di kategori ini.</p>
      ) : (
        <ul className="space-y-4">
          {gadgets.map((gadget) => (
            <li
              key={gadget.id}
              className="p-4 border rounded-md shadow-sm flex gap-4 items-start"
            >
              <Image
                src={gadget.image}
                alt={gadget.name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{gadget.name}</h3>
                <p className="text-sm text-gray-600">
                  Kategori: {gadget.category.name}
                </p>
                <p className="text-sm">Harga: Rp {gadget.price.toLocaleString()}</p>
                <p className="text-sm">Status: {gadget.status}</p>

                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/gadget/edit/${gadget.id}`}
                    className="text-sm text-blue-600 underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={`/api/gadget/${gadget.id}`}
                    method="POST"
                    onSubmit={(e) => {
                      if (!confirm("Yakin ingin menghapus gadget ini?")) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="text-sm text-red-600 underline">
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
