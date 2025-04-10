import Image from "next/image";
import { User, Server } from "@prisma/client";
import { ServerBio } from "@/components/chat-page-components/server-bio";

interface ServerWithRelations extends Server {
  owner: {
    id: string;
    profile?: {
      id: string;
      userName: string;
      bio: string | null;
      avatarUrl: string | null;
    } | null;
  };
  members: { user: User }[];
  channels: { id: string; name: string; messages: any[] }[];
}

interface ServerWelcomePageProps {
  server: ServerWithRelations;
  currentUser: User;
}

const ServerWelcomePage = ({ server, currentUser }: ServerWelcomePageProps) => {
  const memberCount = server.members.length;
  const channelCount = server.channels.length;
  const messageCount = server.channels.reduce(
    (acc, channel) => acc + channel.messages.length, 
    0
  );
  const creationDate = new Date(server.createdAt).toLocaleDateString();
  const isOwner = server.ownerId === currentUser.id;
  
  return (
    <div className="flex flex-col h-full p-6 bg-zinc-800">
      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
          <Image
            fill
            src={server.serverImage}
            alt={server.name}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{server.name}</h1>
          <p className="text-sm text-zinc-500">
            Created by {server.owner.profile?.userName || "Unknown"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="bg-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Server Information</h2>
          
          {isOwner ? (
            <ServerBio 
              serverId={server.id} 
              initialBio={server.bio || ""}
            />
          ) : (
            <p className="text-sm text-zinc-300">
              {server.bio || "This server hasn't added a bio yet."}
            </p>
          )}
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Server Statistics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">👥</span>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Members</p>
                <p className="text-xl font-bold">{memberCount}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">💬</span>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Messages</p>
                <p className="text-xl font-bold">{messageCount}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">#</span>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Channels</p>
                <p className="text-xl font-bold">{channelCount}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">📅</span>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Created</p>
                <p className="text-md font-bold">{creationDate}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">About the Owner</h2>
          
          <div className="flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image
                fill
                src={server.owner.profile?.avatarUrl || "/default-avatar.png"}
                alt={server.owner.profile?.userName || "Unknown"}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{server.owner.profile?.userName || "Unknown"}</h3>
              <p className="text-sm text-zinc-400">
                {server.owner.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Active Channels</h2>
          
          {server.channels.length > 0 ? (
            <div className="space-y-2">
              {server.channels
                .sort((a, b) => b.messages.length - a.messages.length)
                .slice(0, 5)
                .map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between py-1 border-b border-zinc-700">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded bg-zinc-700 flex items-center justify-center text-zinc-400 text-xs mr-2">#</div>
                      <span className="text-sm">{channel.name}</span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {channel.messages.length} messages
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No channels yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerWelcomePage;