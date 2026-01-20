import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";  // ← Changed import
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        console.log('Route hit!'); // ← Add this first to confirm route is reached
        
        const { userId } = await auth();  // ← Changed to auth() with await

        console.log('User ID:', userId); // ← Check if userId exists
        
        if (!userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }
        
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds } = await request.json();
        
        console.log('Received:', { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds });
        
        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");
            
        console.log('Expected signature:', expectedSign);
        console.log('Received signature:', razorpay_signature);
        console.log('Match:', razorpay_signature === expectedSign);
        
        if (razorpay_signature === expectedSign) {
            await prisma.order.updateMany({
                where: {
                    id: { in: orderIds },
                    userId
                },
                data: {
                    isPaid: true,
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
        console.error('Verify payment error:', error);
        return NextResponse.json({ 
            error: error.message,
            verified: false 
        }, { status: 400 });
    }
}