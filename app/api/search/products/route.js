import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
      store: {
        isActive: true,
      },
    },
    select: {
      id: true,
      name: true,
      images: true,
    },
    take: 6, // limit results
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ products });
}
