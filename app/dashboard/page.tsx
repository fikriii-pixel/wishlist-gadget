import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import CategoryFilter from "@/components/CategoryFilter";
import Link from "next/link";
import Image from "next/image";
import DeleteForm from "@/components/DeleteForm";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/auth/login");

  const selectedCategory = searchParams?.category ?? "all";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const gadgets = await prisma.gadget.findMany({
    where:
      selectedCategory === "all"
        ? { userId: session.user.id }
        : {
            userId: session.user.id,
            categoryId: selectedCategory,
          },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/gadget/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Tambah Gadget
          </Link>
          <Link
            href="/category"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Tambah Kategori
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Filter */}
      <div>
        <CategoryFilter categories={categories} />
      </div>

      {/* Gadget List */}
      {gadgets.length === 0 ? (
        <p className="text-gray-600">Belum ada gadget dalam daftar.</p>
      ) : (
        <ul className="grid gap-4">
          {gadgets.map((gadget) => (
            <li
              key={gadget.id}
              className="p-4 border rounded-md shadow flex gap-4 items-start bg-white"
            >
              <Image
                src={gadget.image}
                alt={gadget.name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-lg">{gadget.name}</h3>
                  <p className="text-sm text-gray-600">
                    Kategori: {gadget.category.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    Harga: Rp {gadget.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Status:{" "}
                    <span className="font-medium text-indigo-600">{gadget.status}</span>
                  </p>
                </div>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/gadget/edit/${gadget.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteForm id={gadget.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
