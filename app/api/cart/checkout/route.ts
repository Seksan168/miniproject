import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function DELETE(req: Request) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    // Delete all items in the cart
    await prisma.cartProduct.deleteMany({
      where: {
        cart_id: cartId,
      },
    });

    return NextResponse.json(
      { message: "Cart has been checked out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during checkout:", error);
    return NextResponse.json({ error: "Failed to checkout" }, { status: 500 });
  }
}
