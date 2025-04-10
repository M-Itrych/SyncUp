import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string; memberId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId, memberId } = params;


    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const memberToRemove = await db.serverMembership.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!memberToRemove) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const isOwner = server.ownerId === dbUser.id;

    const isRemovingOwner = memberToRemove.userId === server.ownerId;

    const isSelf = memberToRemove.userId === dbUser.id;

    if (!isOwner) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (isRemovingOwner) {
      return new NextResponse("Cannot remove the server owner", { status: 400 });
    }

    await db.serverMembership.delete({
      where: {
        id: memberId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SERVER_MEMBER_REMOVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}