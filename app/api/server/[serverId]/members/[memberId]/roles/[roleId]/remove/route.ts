import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string; memberId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { serverId, memberId } = params;
    
    if (!serverId || !memberId) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId
      }
    });
    
    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }
    
    const isOwner = server.ownerId === user.id;
    const isAdmin = await hasPermission(user.id, serverId, "is_admin");
    
    if (!isOwner && !isAdmin) {
      return new NextResponse("Permission denied", { status: 403 });
    }
    
    const membership = await db.serverMembership.findUnique({
      where: {
        id: memberId,
        serverId
      },
      include: {
        user: true
      }
    });
    
    if (!membership) {
      return new NextResponse("Member not found", { status: 404 });
    }

    if (membership.user.id === server.ownerId) {
      return new NextResponse("Cannot remove the server owner", { status: 403 });
    }

    if (membership.user.id === user.id) {
      return new NextResponse("Cannot remove yourself. Use the leave server option instead.", { status: 403 });
    }

    await db.serverMembership.delete({
      where: {
        id: memberId
      }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[MEMBER_REMOVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}