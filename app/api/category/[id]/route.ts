import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const method = formData.get("_method");

    // Ambil ID dari URL
    const id = req.nextUrl.pathname.split("/").pop(); // /api/category/:id

    if (!id) {
      return NextResponse.json({ message: "ID tidak ditemukan" }, { status: 400 });
    }

    if (method === "PUT") {
      const name = formData.get("name") as string;
      if (!name) {
        return NextResponse.json({ message: "Nama tidak boleh kosong" }, { status: 400 });
      }

      await prisma.category.update({
        where: { id },
        data: { name },
      });

      return NextResponse.redirect(new URL("/category", req.url));
    }

    if (method === "DELETE") {
      await prisma.category.delete({
        where: { id },
      });

      return NextResponse.redirect(new URL("/category", req.url));
    }

    return NextResponse.json({ message: "Metode tidak didukung" }, { status: 400 });

  } catch (error: unknown) {
    // Penanganan error khusus Prisma (misalnya foreign key constraint saat DELETE)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json({
        message: "Kategori tidak dapat dihapus karena masih digunakan oleh gadget.",
      }, { status: 400 });
    }

    // Fallback error
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
