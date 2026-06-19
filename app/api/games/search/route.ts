import { NextRequest, NextResponse } from "next/server";

/**
 * Search for games in IGDB database
 * GET /api/games/search?query=pokemon
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    // TODO: Implement IGDB API search
    // This will be implemented in Phase 2
    return NextResponse.json({
      games: [],
      message: "IGDB search coming soon",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 }
    );
  }
}
