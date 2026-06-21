import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const sampleGames = [
  {
    igdbId: 1,
    title: "Horizon Forbidden West",
    coverImage:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1p87.jpg",
    genre: "Action RPG",
    platforms: "PlayStation 5",
  },
  {
    igdbId: 2,
    title: "Elden Ring",
    coverImage:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co4vjc.jpg",
    genre: "Action RPG",
    platforms: "PC, PlayStation 5, Xbox Series X",
  },
  {
    igdbId: 3,
    title: "The Legend of Zelda: Tears of the Kingdom",
    coverImage:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co5z9s.jpg",
    genre: "Adventure",
    platforms: "Nintendo Switch",
  },
  {
    igdbId: 4,
    title: "Forza Horizon 5",
    coverImage:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co86z5.jpg",
    genre: "Racing",
    platforms: "PC, Xbox Series X",
  },
  {
    igdbId: 5,
    title: "Overwatch 2",
    coverImage:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co3z38.jpg",
    genre: "Shooter",
    platforms: "PC, PlayStation 5, Xbox Series X",
  },
];

function buildCoverUrl(url: string): string {
  if (!url) return "";
  const normalized = url.startsWith("//") ? `https:${url}` : url;
  return normalized.replace("t_thumb", "t_cover_big");
}

let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

async function fetchTwitchAccessToken(clientId: string, clientSecret: string) {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiry > now + 30_000) {
    return cachedToken;
  }

  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(
    clientId
  )}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`;

  const response = await axios.post(tokenUrl);
  const data = response.data;

  if (!data?.access_token || !data?.expires_in) {
    throw new Error("Failed to fetch Twitch access token");
  }

  cachedToken = data.access_token;
  cachedTokenExpiry = now + Number(data.expires_in) * 1000;
  return cachedToken;
}

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

  const clientId = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_ACCESS_TOKEN;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  let authToken = accessToken;
  if (!authToken && clientId && clientSecret) {
    try {
      authToken = await fetchTwitchAccessToken(clientId, clientSecret);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "Could not fetch IGDB access token from Twitch. Verify your Twitch/IGDB credentials.",
        },
        { status: 500 }
      );
    }
  }

  if (!clientId || !authToken) {
    const fallbackResults = sampleGames.filter((game) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json({
      games: fallbackResults.length > 0 ? fallbackResults : sampleGames,
      message:
        "IGDB credentials not configured. Showing sample results for development.",
    });
  }

  try {
    const requestBody = `fields id,name,cover.url,genres.name,platforms.name,first_release_date,summary; search "${query}"; limit 12; sort first_release_date desc;`;
    const response = await axios.post("https://api.igdb.com/v4/games", requestBody, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "text/plain",
      },
    });

    const games = (response.data || []).map((game: any) => ({
      igdbId: game.id,
      title: game.name,
      coverImage: game.cover?.url ? buildCoverUrl(game.cover.url) : undefined,
      genre:
        Array.isArray(game.genres) && game.genres.length > 0
          ? game.genres.map((genre: any) => genre.name).join(", ")
          : undefined,
      platforms:
        Array.isArray(game.platforms) && game.platforms.length > 0
          ? game.platforms.map((platform: any) => platform.name).join(", ")
          : undefined,
      summary: game.summary,
    }));

    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Could not fetch IGDB games. Please verify your IGDB credentials and access token.",
      },
      { status: 500 }
    );
  }
}
