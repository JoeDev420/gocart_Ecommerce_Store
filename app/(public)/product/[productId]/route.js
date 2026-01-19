import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      rating: true,
      store: true,
    },
  });

  return NextResponse.json({ product });
}
