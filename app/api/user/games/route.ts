import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Add a game to user's library
 * POST /api/user/games
 * Body: { gameId: string, consoleId: string }
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Get user session and validate
    // const session = await getServerSession();
    
    const body = await request.json();
    const { gameId, consoleId } = body;

    if (!gameId || !consoleId) {
      return NextResponse.json(
        { error: "gameId and consoleId are required" },
        { status: 400 }
      );
    }

    // TODO: Implement adding game to user's library
    return NextResponse.json(
      { message: "Game added to library" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add game" },
      { status: 500 }
    );
  }
}

/**
 * Get user's games
 * GET /api/user/games
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user session
    // const session = await getServerSession();
    
    // TODO: Fetch user's games from database
    return NextResponse.json({ games: [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
