import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request){
    try {
        const { userId, has } = getAuth(request)
        if(!userId){
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }
        const { addressId, items, couponCode, paymentMethod } = await request.json()

        // Check if all required fields are present
        if(!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0){
           return NextResponse.json({ error: "missing order details." }, { status: 401 }); 
        }

        let coupon = null;

        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: {code: couponCode }
            })
            if (!coupon){
                return NextResponse.json({ error: "Coupon not found" }, { status: 400 })
            }
        }
         
        // Check if coupon is applicable for new users
        if(couponCode && coupon.forNewUser){
            const userorders = await prisma.order.findMany({where: {userId}})
            if(userorders.length > 0){
                return NextResponse.json({ error: "Coupon valid for new users" }, { status: 400 })
            }
        }

        const isPlusMember = has({plan: 'plus'})

        // Check if coupon is applicable for members
        if (couponCode && coupon.forMember){
            if(!isPlusMember){
                return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 })
            }
        }

        // Validate stock for all items first
        for(const item of items){
            const product = await prisma.product.findUnique({
                where: {id: item.id}
            })
            
            if (!product) {
                return NextResponse.json({ 
                    error: `Product not found` 
                }, { status: 400 })
            }

            if (!product.inStock || product.stock === 0) {
                return NextResponse.json({ 
                    error: `${product.name} is out of stock` 
                }, { status: 400 })
            }

            if (item.quantity > product.stock) {
                return NextResponse.json({ 
                    error: `Only ${product.stock} units of ${product.name} available` 
                }, { status: 400 })
            }

            if (item.quantity <= 0) {
                return NextResponse.json({ 
                    error: `Invalid quantity for ${product.name}` 
                }, { status: 400 })
            }
        }

        // Group orders by storeId using a Map
        const ordersByStore = new Map()

        for(const item of items){
            const product = await prisma.product.findUnique({where: {id: item.id}})
            const storeId = product.storeId
            if(!ordersByStore.has(storeId)){
                ordersByStore.set(storeId, [])
            }
            ordersByStore.get(storeId).push({...item, price: product.price})
        }

        let orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false

        // Create orders for each seller
        await prisma.$transaction(async (tx) => {
            for(const [storeId, sellerItems] of ordersByStore.entries()){
                let total = sellerItems.reduce((acc, item)=>acc + (item.price * item.quantity), 0)

                if(couponCode){
                    total -= (total * coupon.discount) / 100;
                }
                if(!isPlusMember && !isShippingFeeAdded){
                    total += 5;
                    isShippingFeeAdded = true
                }

                fullAmount += parseFloat(total.toFixed(2))

                const order = await tx.order.create({
                    data: {
                        userId,
                        storeId,
                        addressId,
                        total: parseFloat(total.toFixed(2)),
                        paymentMethod,
                        isCouponUsed: coupon ? true : false,
                        coupon: coupon ? coupon : {},
                        orderItems: {
                            create: sellerItems.map(item => ({
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    }
                })
                orderIds.push(order.id)

                // Decrement stock for each product in this order
                for(const item of sellerItems){
                    const product = await tx.product.findUnique({
                        where: { id: item.id }
                    })

                    const newStock = product.stock - item.quantity

                    await tx.product.update({
                        where: { id: item.id },
                        data: {
                            stock: newStock,
                            inStock: newStock > 0
                        }
                    })
                }
            }

            // Clear the cart
            await tx.user.update({
                where: {id: userId},
                data: {cart : {}}
            })
        })

        // Razorpay Integration (using STRIPE enum value)
        if(paymentMethod === 'STRIPE'){
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_SECRET_KEY
            })

            // Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(fullAmount * 100), // Amount in paise (INR)
                currency: 'INR',
                receipt: `order_${orderIds.join('_')}`,
                notes: {
                    orderIds: orderIds.join(','),
                    userId,
                    appId: 'gocart'
                }
            })

            return NextResponse.json({
                razorpayOrder,
                orderIds,
                keyId: process.env.RAZORPAY_KEY_ID
            })
        }

        return NextResponse.json({message: 'Orders Placed Successfully'})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all orders for a user
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const orders = await prisma.order.findMany({
            where: {userId, OR: [
                {paymentMethod: PaymentMethod.COD},
                {AND: [{paymentMethod: PaymentMethod.STRIPE}, {isPaid: true}]}
            ]},
            include: {
                orderItems: {include: {product: true}},
                address: true
            },
            orderBy: {createdAt: 'desc'}
        })

        return NextResponse.json({orders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}