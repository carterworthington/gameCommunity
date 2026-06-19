import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { email: string, username: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { email, username, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        // Create default availability status
        availabilityStatus: {
          create: {
            status: "offline",
            consoles: "[]",
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
