import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, channelId } = await req.json();

    if (!content || !channelId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const updatedMessage = await db.message.update({
      where: { 
        id: params.messageId,
        senderId: user.id 
      },
      data: { 
        content,
        isEdited: true
      }
    });

    const userProfile = await db.profile.findUnique({
      where: { userId: user.id }
    });
    await pusherServer.trigger(`channel-${channelId}`, 'message:update', {
      ...updatedMessage,
      createdAt: updatedMessage.createdAt.toISOString(),
      user: {
        id: user.id,
        name: userProfile?.userName || 'Unknown User',
        image: userProfile?.avatarUrl || '/default-avatar.png',
      }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('[MESSAGE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const existingMessage = await db.message.findUnique({
      where: { id: params.messageId }
    });

    if (!existingMessage) {
      return new NextResponse('Message not found', { status: 404 });
    }
    const deletedMessage = await db.message.update({
      where: { 
        id: params.messageId,
        senderId: user.id 
      },
      data: { 
        content: '[Message deleted]',
        isDeleted: true
      }
    });
    await pusherServer.trigger(`channel-${existingMessage.channelId}`, 'message:delete', {
      messageId: params.messageId,
      content: '[Message deleted]',
      isDeleted: true
    });

    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.error('[MESSAGE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}