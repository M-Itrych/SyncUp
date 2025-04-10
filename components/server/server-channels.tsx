import { db } from "@/lib/db";
import { Server } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerChannel } from "./server-channel";

interface ServerChannelsProps {
    server: Server;
}

export const ServerChannels = async ({ server }: ServerChannelsProps) => {
    const channels = await db.channel.findMany({
        where: {
            serverId: server.id
        }
    });
    
    return (
        <div className="mb-2">
            <div className="px-2">
                <div className="flex items-center justify-between py-2">
                    <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                        Channels
                    </p>
                </div>
            </div>
            <ScrollArea className="flex-1">
                {channels.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel}  />
                ))}
            </ScrollArea>
        </div>
    );
};