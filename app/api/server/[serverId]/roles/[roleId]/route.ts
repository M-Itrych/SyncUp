// app/api/server/[serverId]/roles/[roleId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";

// Update a role
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string; roleId: string } }
) {
  try {
    const user = await currentUser();
    const { name, permissions } = await req.json();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId || !params.roleId) {
      return new NextResponse("Server ID and Role ID are required", { status: 400 });
    }
    
    if (!name) {
      return new NextResponse("Role name is required", { status: 400 });
    }
    
    const server = await db.server.findUnique({
      where: {
        id: params.serverId
      }
    });
    
    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }
    
    const role = await db.role.findUnique({
      where: {
        id: params.roleId,
        serverId: params.serverId
      }
    });
    
    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }
    
    const isOwner = user.id === server.ownerId;
    const isAdmin = await hasPermission(user.id, params.serverId, "is_admin");
    
    if (!isOwner && !isAdmin) {
      return new NextResponse("Permission denied", { status: 403 });
    }
    
    const updatedRole = await db.role.update({
      where: {
        id: params.roleId
      },
      data: {
        name,
        permissions
      }
    });
    
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.log("[ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete a role
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string; roleId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId || !params.roleId) {
      return new NextResponse("Server ID and Role ID are required", { status: 400 });
    }
    
    const server = await db.server.findUnique({
      where: {
        id: params.serverId
      }
    });
    
    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }
    
    const role = await db.role.findUnique({
      where: {
        id: params.roleId,
        serverId: params.serverId
      }
    });
    
    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }
    
    const isOwner = user.id === server.ownerId;
    const isAdmin = await hasPermission(user.id, params.serverId, "is_admin");
    
    if (!isOwner && !isAdmin) {
      return new NextResponse("Permission denied", { status: 403 });
    }
    
    // Remove role references from memberships
    await db.serverMembership.updateMany({
      where: {
        serverId: params.serverId
      },
      data: {
        // Remove this role from the roles connection
      }
    });
    
    // Delete the role
    await db.role.delete({
      where: {
        id: params.roleId
      }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[ROLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get a specific role
export async function GET(
  req: Request,
  { params }: { params: { serverId: string; roleId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId || !params.roleId) {
      return new NextResponse("Server ID and Role ID are required", { status: 400 });
    }
    
    const server = await db.server.findUnique({
      where: {
        id: params.serverId
      },
      include: {
        members: {
          where: {
            userId: user.id
          }
        }
      }
    });
    
    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }
    
    if (!server.members.length) {
      return new NextResponse("User not a member of this server", { status: 403 });
    }
    
    const role = await db.role.findUnique({
      where: {
        id: params.roleId,
        serverId: params.serverId
      }
    });
    
    if (!role) {
      return new NextResponse("Role not found", { status: 404 });
    }
    
    return NextResponse.json(role);
  } catch (error) {
    console.log("[ROLE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}