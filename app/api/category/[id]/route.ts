import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const formData = await req.formData();
  const method = formData.get("_method");

  if (method === "PUT") {
    const name = formData.get("name") as string;
    if (!name) {
      return NextResponse.json({ message: "Nama tidak boleh kosong" }, { status: 400 });
    }

    await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.redirect(new URL("/category", req.url));
  }

  if (method === "DELETE") {
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.redirect(new URL("/category", req.url));
  }

  return NextResponse.json({ message: "Metode tidak didukung" }, { status: 400 });
}
