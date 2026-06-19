import { NextRequest, NextResponse } from "next/server";

/**
 * Update user's availability status
 * POST /api/availability
 * Body: { status: 'available' | 'away' | 'offline', consoles?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, consoles } = body;

    if (!status || !["available", "away", "offline"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required: available, away, or offline" },
        { status: 400 }
      );
    }

    // TODO: Update availability status in database
    return NextResponse.json(
      { message: "Availability status updated" },
      { status: 200 }
    );
  } catch (error) {
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
    // TODO: Get user session
    // const session = await getServerSession();
    
    // TODO: Fetch user's availability status
    return NextResponse.json({
      status: "offline",
      consoles: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
