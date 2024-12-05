import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        image_url: true,
        remaining: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(req: Request) {
  try {
    const { name, price, image_url, remaining } = await req.json();
    const newProduct = await prisma.product.create({
      data: { name, price, image_url, remaining },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(req: Request) {
  try {
    const { id, name, price, image_url, remaining } = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, image_url, remaining },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
// DELETE handler
export async function DELETE(req: Request) {
  try {
    // Extract the product ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Assuming the URL is like /api/products/{id}

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete the product by ID
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
