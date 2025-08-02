import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, image, price, status, categoryId } = await req.json();

  if (!name || !image || !price || !status || !categoryId) {
    return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
  }

  const gadget = await prisma.gadget.create({
    data: {
      name,
      image,
      price,
      status,
      categoryId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(gadget);
}
