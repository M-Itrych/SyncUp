import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { redirect } from "next/navigation";
import { Compass, MessageSquare, Server, Users } from "lucide-react";

const AppPage = async () => {
  const user = await initialUser();
  
  const profile = await db.profile.findFirst({
    where: {
      userId: user.id
    }
  });
  
  if (!profile) {
    return redirect("/a");
  }
  
  // Fetch statistics
  const totalUsers = await db.user.count();
  const totalServers = await db.server.count();
  const totalMessages = await db.message.count();
  const totalChannels = await db.channel.count();
  
  // User-specific data
  const userServers = await db.serverMembership.count({
    where: {
      userId: user.id
    }
  });
  
  const userMessages = await db.message.count({
    where: {
      senderId: user.id
    }
  });
  
  const userOwnedServers = await db.server.count({
    where: {
      ownerId: user.id
    }
  });
  
  // Get recent servers joined
  const recentServers = await db.serverMembership.findMany({
    where: {
      userId: user.id
    },
    include: {
      server: true
    },
    orderBy: {
      joinedAt: "desc"
    },
    take: 3
  });
  
  // Get recent messages
  const recentMessages = await db.message.findMany({
    where: {
      senderId: user.id
    },
    include: {
      channel: {
        include: {
          server: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-white">
            Welcome back, {profile.userName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {profile.bio || "Your communication hub awaits. Explore your servers, channels, and connect with others."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Your Servers" 
            value={userServers} 
            icon={<Server className="w-8 h-8 text-indigo-500" />}
            description="Servers you're a member of"
            gradient="from-indigo-500 to-purple-600"
          />
          
          <StatCard 
            title="Owned Servers" 
            value={userOwnedServers} 
            icon={<Compass className="w-8 h-8 text-emerald-500" />}
            description="Servers you've created"
            gradient="from-emerald-500 to-teal-600"
          />
          
          <StatCard 
            title="Your Messages" 
            value={userMessages} 
            icon={<MessageSquare className="w-8 h-8 text-blue-500" />}
            description="Messages you've sent"
            gradient="from-blue-500 to-cyan-600"
          />
          
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={<Users className="w-8 h-8 text-rose-500" />}
            description="Users on the platform"
            gradient="from-rose-500 to-pink-600"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">
              Platform Statistics
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Servers</span>
                  <Server className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-zinc-800 dark:text-white mt-2">{totalServers}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Messages</span>
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-zinc-800 dark:text-white mt-2">{totalMessages}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Users</span>
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-2xl font-bold text-zinc-800 dark:text-white mt-2">{totalUsers}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Channels</span>
                  <Compass className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-zinc-800 dark:text-white mt-2">{totalChannels}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">
              Recent Activity
            </h2>
            
            {recentServers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Recently Joined Servers
                </h3>
                <div className="space-y-3">
                  {recentServers.map((membership) => (
                    <div key={membership.id} className="flex items-center p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                        <Server className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-800 dark:text-white">{membership.server.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {new Date(membership.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {recentMessages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Recent Messages
                </h3>
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                      <div className="flex items-center mb-1">
                        <p className="font-medium text-zinc-800 dark:text-white">
                          {message.channel?.server?.name || "Direct Message"}
                        </p>
                        <span className="mx-2 text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  gradient: string;
  onClick?: () => void;
  href?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  gradient,
  onClick,
  href 
}: StatCardProps) => {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <a 
          href={href}
          className="block transition-transform duration-200 hover:scale-105"
        >
          {children}
        </a>
      );
    }
    
    if (onClick) {
      return (
        <button 
          onClick={onClick} 
          className="w-full text-left transition-transform duration-200 hover:scale-105"
        >
          {children}
        </button>
      );
    }
    
    return <>{children}</>;
  };
  
  return (
    <CardWrapper>
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">{title}</h3>
            {icon}
          </div>
          <p className="text-3xl font-bold text-zinc-800 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </CardWrapper>
  );
};

export default AppPage;