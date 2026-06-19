import { NextRequest, NextResponse } from "next/server";

/**
 * Send a friend request
 * POST /api/friends/request
 * Body: { recipientId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientId } = body;

    if (!recipientId) {
      return NextResponse.json(
        { error: "recipientId is required" },
        { status: 400 }
      );
    }

    // TODO: Create friend request in database
    return NextResponse.json(
      { message: "Friend request sent" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
