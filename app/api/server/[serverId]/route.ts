import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    const { name, serverImage } = await req.json();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    
    if (!name || !serverImage) {
      return new NextResponse("Name and server image are required", { status: 400 });
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
    const canEdit = await hasPermission(user.id, params.serverId, "can_edit_server");
    const isAdmin = await hasPermission(user.id, params.serverId, "is_admin");
    
    if (!isOwner && !canEdit && !isAdmin) {
      return new NextResponse("Permission denied", { status: 403 });
    }
    
    const updatedServer = await db.server.update({
      where: {
        id: params.serverId
      },
      data: {
        name,
        serverImage
      }
    });
    
    return NextResponse.json(updatedServer);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}