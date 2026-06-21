import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

/**
 * Update user's availability status
 * POST /api/availability
 * Body: { status: 'available' | 'away' | 'offline', consoles?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, consoles } = body;

    if (!status || !["available", "away", "offline"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required: available, away, or offline" },
        { status: 400 }
      );
    }

    if (consoles !== undefined && !Array.isArray(consoles)) {
      return NextResponse.json(
        { error: "Consoles must be an array" },
        { status: 400 }
      );
    }

    await prisma.availabilityStatus.upsert({
      where: { userId: session.user.id },
      update: {
        status,
        consoles: JSON.stringify(consoles ?? []),
      },
      create: {
        userId: session.user.id,
        status,
        consoles: JSON.stringify(consoles ?? []),
      },
    });

    return NextResponse.json(
      { message: "Availability status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Availability update error:", error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}

/**
 * Get user's current availability
 * GET /api/availability
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const availability = await prisma.availabilityStatus.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      status: availability?.status ?? "offline",
      consoles: availability?.consoles ? JSON.parse(availability.consoles) : [],
    });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
