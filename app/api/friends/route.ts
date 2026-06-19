import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [friends, incomingRequests, outgoingRequests] = await Promise.all([
      prisma.friend.findMany({
        where: { userId: session.user.id },
        include: { friend: true },
      }),
      prisma.friendRequest.findMany({
        where: { receiverId: session.user.id, status: "pending" },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.friendRequest.findMany({
        where: { senderId: session.user.id, status: "pending" },
        include: { receiver: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ friends, incomingRequests, outgoingRequests });
  } catch (error) {
    console.error("Friends fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
