import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds } = await request.json();
        // Verify signature
        console.log('Received:', { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds });
        console.log('Expected signature:', expectedSign);
        console.log('Received signature:', razorpay_signature);
        console.log('Match:', razorpay_signature === expectedSign);


        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");
        if (razorpay_signature === expectedSign) {
            // Payment is verified, update orders
            // Using existing Stripe fields to store Razorpay data
            const orderIdArray = orderIds.map(id => id);

            await prisma.order.updateMany({
                where: {
                    id: { in: orderIdArray },
                    userId
                },
                data: {
                    isPaid: true,
                    stripeSessionId: razorpay_order_id,     // Store Razorpay order ID
                    stripePaymentIntentId: razorpay_payment_id  // Store Razorpay payment ID
                }
            });
            return NextResponse.json({ 
                message: "Payment verified successfully",
                verified: true 
            });
        } else {
            return NextResponse.json({ 
                error: "Invalid signature",
                verified: false 
            }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            error: error.message,
            verified: false 
        }, { status: 400 });
    }
}