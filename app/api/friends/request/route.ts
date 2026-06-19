import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

/**
 * Send a friend request
 * POST /api/friends/request
 * Body: { recipientId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId } = body;

    if (!recipientId) {
      return NextResponse.json(
        { error: "recipientId is required" },
        { status: 400 }
      );
    }

    if (recipientId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot send a request to yourself." },
        { status: 400 }
      );
    }

    const existingFriend = await prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: session.user.id,
          friendId: recipientId,
        },
      },
    });

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: session.user.id,
            receiverId: recipientId,
          },
          {
            senderId: recipientId,
            receiverId: session.user.id,
          },
        ],
      },
    });

    if (existingFriend) {
      return NextResponse.json(
        { error: "This user is already your friend." },
        { status: 409 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        { error: "A friend request is already pending." },
        { status: 409 }
      );
    }

    await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId: recipientId,
      },
    });

    return NextResponse.json(
      { message: "Friend request sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Friend request error:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
