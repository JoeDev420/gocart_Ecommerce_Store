import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

/**
 * Razorpay sends RAW body for webhook verification.
 * Do NOT parse JSON before verifying signature.
 */
export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Razorpay signature" },
        { status: 400 }
      );
    }

    /**
     * Verify webhook signature
     */
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    /**
     * Helper to update DB based on payment status
     */
    const handleOrderPayment = async ({ orderIds, userId, isPaid }) => {
      const orderIdsArray = orderIds.split(",");

      if (isPaid) {
        // Mark orders as paid
        await Promise.all(
          orderIdsArray.map((orderId) =>
            prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true },
            })
          )
        );

        // Clear user's cart
        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        });
      } else {
        // Delete failed orders
        await Promise.all(
          orderIdsArray.map((orderId) =>
            prisma.order.delete({
              where: { id: orderId },
            })
          )
        );
      }
    };

    /**
     * Handle Razorpay events
     */
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;

        const { orderIds, userId, appId } = payment.notes || {};

        if (appId !== "gocart") {
          return NextResponse.json({
            received: true,
            message: "Invalid app id",
          });
        }

        await handleOrderPayment({
          orderIds,
          userId,
          isPaid: true,
        });

        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;

        const { orderIds, userId, appId } = payment.notes || {};

        if (appId !== "gocart") {
          return NextResponse.json({
            received: true,
            message: "Invalid app id",
          });
        }

        await handleOrderPayment({
          orderIds,
          userId,
          isPaid: false,
        });

        break;
      }

      default:
        console.log("Unhandled Razorpay event:", event.event);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
