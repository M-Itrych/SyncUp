import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { bio } = await req.json();
    
    const server = await db.server.findUnique({
      where: {
        id: params.serverId,
      },
    });
    
    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }
    
    if (server.ownerId !== user.id) {
      return new NextResponse("Forbidden - only server owners can update bio", { status: 403 });
    }
    
    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        bio,
      },
    });
    
    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error("[SERVER_BIO_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}