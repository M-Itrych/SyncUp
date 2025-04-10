import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string; memberId: string; roleId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { serverId, memberId, roleId } = params;
    
    if (!serverId || !memberId || !roleId) {
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
      return new NextResponse("Cannot modify server owner's roles", { status: 403 });
    }
    
    const role = await db.role.findUnique({
      where: {
        id: roleId,
        serverId
      }
    });
    
    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }

    const updatedMembership = await db.serverMembership.update({
      where: {
        id: memberId
      },
      data: {
        roles: {
          connect: {
            id: roleId
          }
        }
      },
      include: {
        roles: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedMembership);
  } catch (error) {
    console.log("[MEMBER_ROLE_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}