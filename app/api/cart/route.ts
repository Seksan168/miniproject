import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

// GET handler
export async function GET() {
  try {
    const carts = await prisma.product.findMany();
    return NextResponse.json(carts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body to extract productId and quantity
    const { userId, productId, quantity } = await req.json();

    // Convert userId to integer
    const parsedUserId = parseInt(userId, 10);

    // Function to add product to cart
    const addProductToCart = async (
      userId: number,
      productId: number,
      quantity: number
    ) => {
      // Check if there's enough stock available
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.remaining < quantity) {
        throw new Error("Not enough stock available.");
      }

      // Find or create a cart for the user
      let cart = await prisma.cart.findFirst({
        where: { user_id: userId },
      });

      if (!cart) {
        // Create a new cart if the user doesn't have one
        cart = await prisma.cart.create({
          data: { user_id: userId },
        });
      }

      // Add product to cart
      const cartItem = await prisma.cartProduct.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity,
        },
      });

      // Decrease stock of the product
      await prisma.product.update({
        where: { id: productId },
        data: { remaining: product.remaining - quantity },
      });

      return cartItem; // Return the added cart item as a response
    };

    // Call the function to add the product to the cart
    const newCartItem = await addProductToCart(
      parsedUserId,
      productId,
      quantity
    );

    // Respond with the newly added cart item
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
