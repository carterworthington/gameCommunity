import { NextRequest, NextResponse } from "next/server";

/**
 * Friend management endpoints
 * GET /api/friends - Get user's friends
 * POST /api/friends/request - Send friend request
 * POST /api/friends/accept - Accept friend request
 */

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user session
    // const session = await getServerSession();
    
    // TODO: Fetch user's friends from database
    return NextResponse.json({ friends: [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
