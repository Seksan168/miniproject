import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

// GET handler
export async function GET() {
  try {
    const products = await prisma.product.findMany();
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
    const { id } = await req.json();
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

await prisma.user.findUnique({
  where: { id: 1 },
  include: { cart: { include: { products: { include: { product: true } } } } },
});
