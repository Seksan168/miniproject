import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        // password,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "User could not be created" },
      { status: 500 }
    );
  }
}
