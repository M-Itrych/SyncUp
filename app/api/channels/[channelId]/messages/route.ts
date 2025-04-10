import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { currentUser } from '@/lib/current-user';

export async function POST(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, serverId } = await req.json();
    const { channelId } = await params;

    if (!content || !serverId || !channelId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    const message = await db.message.create({
      data: {
        content,
        channelId,
        senderId: user.id,
      }
    });
    const userProfile = await db.profile.findUnique({
      where: { userId: user.id }
    });

    await pusherServer.trigger(`channel-${channelId}`, 'message:new', {
      ...message,
      user: {
        id: user.id,
        name: userProfile?.userName || 'Unknown User',
        image: userProfile?.avatarUrl || '/default-avatar.png',
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}