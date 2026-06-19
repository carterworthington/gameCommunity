import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

/**
 * Add a game to user's library
 * POST /api/user/games
 * Body: { igdbId?: number, title: string, consoleId: string, coverImage?: string, genre?: string, platforms?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { igdbId, title, consoleId, coverImage, genre, platforms } = body;

    if (!title || !consoleId) {
      return NextResponse.json(
        { error: "title and consoleId are required" },
        { status: 400 }
      );
    }

    const game = igdbId
      ? await prisma.game.upsert({
          where: { igdbId },
          update: {
            title,
            coverImage: coverImage || undefined,
            genre: genre || undefined,
            platforms: platforms || undefined,
          },
          create: {
            igdbId,
            title,
            coverImage: coverImage || undefined,
            genre: genre || undefined,
            platforms: platforms || undefined,
          },
        })
      : await prisma.game.create({
          data: {
            title,
            coverImage: coverImage || undefined,
            genre: genre || undefined,
            platforms: platforms || undefined,
          },
        });

    const existingEntry = await prisma.userGame.findUnique({
      where: {
        userId_gameId_consoleId: {
          userId: session.user.id,
          gameId: game.id,
          consoleId,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "This game is already in your library for the selected console." },
        { status: 409 }
      );
    }

    await prisma.userGame.create({
      data: {
        userId: session.user.id,
        gameId: game.id,
        consoleId,
      },
    });

    return NextResponse.json(
      { message: "Game added to library", game },
      { status: 201 }
    );
  } catch (error) {
    console.error("User game add error:", error);
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
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const games = await prisma.userGame.findMany({
      where: { userId: session.user.id },
      include: {
        game: true,
        console: true,
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("User games fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
