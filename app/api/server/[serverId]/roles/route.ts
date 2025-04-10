import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    const { name, permissions } = await req.json();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
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
    
    const isOwner = user.id === server.ownerId;
    const isAdmin = await hasPermission(user.id, params.serverId, "is_admin");
    
    if (!isOwner && !isAdmin) {
      return new NextResponse("Permission denied", { status: 403 });
    }
    
    const newRole = await db.role.create({
      data: {
        name,
        permissions: permissions || "",
        serverId: params.serverId
      }
    });
    
    return NextResponse.json(newRole);
  } catch (error) {
    console.log("[ROLES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
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
    
    const roles = await db.role.findMany({
      where: {
        serverId: params.serverId
      },
      orderBy: {
        name: "asc"
      }
    });
    
    return NextResponse.json(roles);
  } catch (error) {
    console.log("[ROLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}