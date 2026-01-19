import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      rating: true,
      store: true,
    },
  });

  if (!product || !product.store.isActive) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ product });
}
