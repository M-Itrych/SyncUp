import { NextResponse } from "next/server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
  ) {
    try {
      const profile = await currentUser();
  
      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!params.serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }
  
      const server = await db.server.findUnique({
        where: {
          id: params.serverId,
        },
        select: {
          id: true,
          ownerId: true,
        }
      });
  
      if (!server) {
        return new NextResponse("Server not found", { status: 404 });
      }
  
      if (server.ownerId === profile.id) {
        return new NextResponse("Server owners cannot leave their own server", { status: 400 });
      }
  

      await db.serverMembership.deleteMany({
        where: {
          serverId: params.serverId,
          userId: profile.id
        }
      });
  
      return NextResponse.json({ message: "Successfully left server" });
    } catch (error) {
      console.log("[SERVER_ID_LEAVE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }