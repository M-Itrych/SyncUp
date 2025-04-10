import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import ChannelIdPageClient from '@/components/chat-page-components/chat-page';

export default async function ChannelPage({ params }: { params: { serverId: string, channelId: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const channel = await db.channel.findUnique({
    where: { 
      id: params.channelId,
      serverId: params.serverId 
    }
  });

  if (!channel) return null;
  const initialMessages = await db.message.findMany({
    where: { 
      channelId: params.channelId 
    },
    include: {
      sender: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
    take: 50
  });
  const formattedMessages = initialMessages.map(message => ({
    ...message,
    user: {
      id: message.senderId,
      name: message.sender.profile?.userName || 'Unknown User',
      image: message.sender.profile?.avatarUrl || '/default-avatar.png'
    }
  }));

  return (
    <ChannelIdPageClient 
      channel={channel}
      initialMessages={formattedMessages}
      serverId={params.serverId}
    />
  );
}