import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// update stock of a product
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const { productId, stock } = await request.json()

        if(!productId || stock === undefined){
            return NextResponse.json({ error: "missing details: productId or stock" }, { status: 400 });
        }

        // Validate stock is a non-negative number
        if(typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)){
            return NextResponse.json({ error: 'stock must be a non-negative integer' }, { status: 400 })
        }

        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        // check if product exists
        const product = await prisma.product.findFirst({
             where: {id: productId, storeId}
        })

        if(!product){
            return NextResponse.json({ error: 'no product found' }, { status: 404 })
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { stock: stock }
        })

        return NextResponse.json({
            message: "Product stock updated successfully",
            product: updatedProduct
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}