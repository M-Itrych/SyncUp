import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string; roleId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { memberId, roleId } = params;

    if (!memberId || !roleId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const membership = await db.serverMembership.findUnique({
      where: {
        id: memberId
      },
      include: {
        server: true
      }
    });

    if (!membership) {
      return new NextResponse("Membership not found", { status: 404 });
    }

    const currentUserDb = await db.user.findUnique({
      where: {
        clerkId: user.id
      }
    });

    if (!currentUserDb) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (membership.server.ownerId !== currentUserDb.id) {
      return new NextResponse("Not authorized", { status: 403 });
    }

    const role = await db.role.findFirst({
      where: {
        id: roleId,
        serverId: membership.serverId
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
    console.log("[ROLE_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}