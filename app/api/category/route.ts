import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET semua kategori
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}
