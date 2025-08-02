import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Status } from "@prisma/client";


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const method = formData.get("_method");

  if (method === "PUT") {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const price = Number(formData.get("price"));
    const status = formData.get("status") as string;
    const categoryId = formData.get("categoryId") as string;

    await prisma.gadget.update({
      where: { id: params.id, userId: session.user.id },
      data: { name, image, price, status: status as Status, categoryId },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (method === "DELETE") {
    await prisma.gadget.delete({
      where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.json({ message: "Method not supported" }, { status: 400 });
}
