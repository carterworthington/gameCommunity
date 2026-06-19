import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Request ID and valid action are required." },
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest || friendRequest.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "Friend request not found or not authorized." },
        { status: 404 }
      );
    }

    if (friendRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Friend request is no longer pending." },
        { status: 409 }
      );
    }

    if (action === "reject") {
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });

      return NextResponse.json({ message: "Friend request rejected" });
    }

    // Accept action
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "accepted" },
    });

    await Promise.all([
      prisma.friend.create({
        data: {
          userId: session.user.id,
          friendId: friendRequest.senderId,
        },
      }),
      prisma.friend.create({
        data: {
          userId: friendRequest.senderId,
          friendId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Friend respond error:", error);
    return NextResponse.json(
      { error: "Failed to respond to friend request" },
      { status: 500 }
    );
  }
}
