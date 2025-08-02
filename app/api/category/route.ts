import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get("name") as string;

  if (!name) return NextResponse.json({ message: "Nama kategori wajib diisi" }, { status: 400 });

  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) {
    return NextResponse.json({ message: "Kategori sudah ada" }, { status: 400 });
  }

  const category = await prisma.category.create({ data: { name } });
  return NextResponse.redirect(new URL("/category", req.url));
}
