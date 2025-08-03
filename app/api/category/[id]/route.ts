import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const method = formData.get("_method");

  // Ambil ID dari URL
  const id = req.nextUrl.pathname.split("/").pop(); // ambil ID dari URL

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
}
