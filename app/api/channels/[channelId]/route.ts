import { NextResponse } from "next/server";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";


export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentUser();
    const { name } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
      include: {
        server: true,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }
    const server = await db.server.findUnique({
      where: {
        id: channel.serverId,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    if (server.ownerId !== profile.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const updatedChannel = await db.channel.update({
      where: {
        id: params.channelId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
      include: {
        server: true,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const server = await db.server.findUnique({
      where: {
        id: channel.serverId,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    if (server.ownerId !== profile.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (channel.name === "general") {
      return new NextResponse("Cannot delete general channel", { status: 400 });
    }

    const deletedChannel = await db.channel.delete({
      where: {
        id: params.channelId,
      },
    });

    return NextResponse.json(deletedChannel);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}