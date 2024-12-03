import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

// GET handler
// export async function GET(req: Request) {
//   try {
//     const userId = await req.json();
//     const carts = await prisma.cart.findMany({ where: { user_id: userId } });
//     return NextResponse.json(carts);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// }
export async function GET(req: Request) {
  try {
    // Parse the URL and get the userId from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Fetch carts for the given userId
    const carts = await prisma.cart.findMany({
      where: {
        user_id: parseInt(userId, 10), // Convert userId to integer
      },
      include: {
        products: true, // Optional, include related cart products
      },
    });

    return NextResponse.json(carts);
  } catch (error) {
    console.error("Error fetching cart:", error); // Log for debugging
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch carts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body to extract userId, productId, and quantity
    const { userId, productId, quantity } = await req.json();

    // Convert userId to integer
    const parsedUserId = parseInt(userId, 10);

    // Function to add or update the product in the cart
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

      // Check if the product already exists in the cart
      const existingCartItem = await prisma.cartProduct.findFirst({
        where: {
          cart_id: cart.id,
          product_id: productId,
        },
      });

      if (existingCartItem) {
        // Update the quantity if the product is already in the cart
        const updatedCartItem = await prisma.cartProduct.update({
          where: {
            cart_id_product_id: {
              cart_id: cart.id,
              product_id: productId,
            },
          },
          data: {
            quantity: existingCartItem.quantity + quantity, // Increase the quantity
          },
        });

        // Decrease the stock of the product
        await prisma.product.update({
          where: { id: productId },
          data: { remaining: product.remaining - quantity },
        });

        return updatedCartItem; // Return the updated cart item
      } else {
        // Add product to the cart if it's not already there
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

        return cartItem; // Return the newly added cart item
      }
    };

    // Call the function to add or update the product in the cart
    const newCartItem = await addProductToCart(
      parsedUserId,
      productId,
      quantity
    );

    // Respond with the added or updated cart item
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add product to cart" },
      { status: 500 }
    );
  }
}

// PUT handler - Update Item Quantity
const handleChange = async (
  cartId: number,
  productId: number,
  newQuantity: number
) => {
  try {
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        productId,
        quantity: newQuantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update quantity");
    }

    const updatedItem = await response.json();
    console.log("Updated item:", updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

// DELETE handler - Remove Item from Cart
export async function DELETE(req: Request) {
  try {
    const { cartId, productId } = await req.json();
    // Delete the specific CartProduct item by cartId and productId
    await prisma.cartProduct.delete({
      where: {
        cart_id_product_id: {
          cart_id: cartId,
          product_id: productId,
        },
      },
    });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
