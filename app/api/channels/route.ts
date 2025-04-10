import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const user = await currentUser();
      const { name, type } = await req.json();
      const { searchParams } = new URL(req.url);
      
      const serverId = searchParams.get("serverId");
      
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }
      

      const server = await db.server.findFirst({
        where: {
          id: serverId,
          ownerId: user.id
        }
      });
      
      if (!server) {
        return new NextResponse("Forbidden - Not server owner", { status: 403 });
      }
      
      const updatedServer = await db.server.update({
        where: {
          id: serverId
        },
        data: {
          channels: {
            create: {
              type,
              name,
            }
          },
        }
      });
      
      return NextResponse.json(updatedServer);
    } catch (error) {
      console.log("[CHANNEL_POST]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }