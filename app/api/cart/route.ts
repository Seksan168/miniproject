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
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    // Parse the request body to extract userId, productId, and quantity
    const { productId, quantity } = await req.json();

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
        where: { userId },
      });

      if (!cart) {
        // Create a new cart if the user doesn't have one
        cart = await prisma.cart.create({
          data: { userId },
        });
      }

      // Add product to cart
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
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
    const newCartItem = await addProductToCart(userId, productId, quantity);

    // Respond with the newly added cart item
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
