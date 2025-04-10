import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { currentUser } from '@/lib/current-user';

export async function POST(req: NextRequest) {
  const user = await currentUser();
  
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { socket_id, channel_name } = await req.json();

  try {

    const auth = pusherServer.authorizeChannel(socket_id, channel_name);
    return NextResponse.json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return new NextResponse('Unauthorized', { status: 401 });
  }
}