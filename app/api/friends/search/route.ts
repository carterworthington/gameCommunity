import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = request.nextUrl.searchParams.get("query");
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Please provide at least 2 characters." },
        { status: 400 }
      );
    }

    const [friends, outgoingRequests, incomingRequests] = await Promise.all([
      prisma.friend.findMany({
        where: { userId: session.user.id },
        select: { friendId: true },
      }),
      prisma.friendRequest.findMany({
        where: { senderId: session.user.id, status: "pending" },
        select: { receiverId: true },
      }),
      prisma.friendRequest.findMany({
        where: { receiverId: session.user.id, status: "pending" },
        select: { senderId: true },
      }),
    ]);

    const friendIds = new Set(friends.map((item) => item.friendId));
    const requestedIds = new Set(outgoingRequests.map((item) => item.receiverId));
    const receivedIds = new Set(incomingRequests.map((item) => item.senderId));

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
      take: 12,
    });

    const results = users.map((user) => ({
      ...user,
      status: friendIds.has(user.id)
        ? "friend"
        : requestedIds.has(user.id)
        ? "requested"
        : receivedIds.has(user.id)
        ? "requestReceived"
        : "none",
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Friend search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
