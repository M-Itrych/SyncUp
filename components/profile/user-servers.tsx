"use client";

import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";
import { Crown } from "lucide-react";

interface UserServersProps {
  servers: Server[];
  ownedServers: Server[];
  userId: string;
}

export const UserServers = ({ servers, ownedServers, userId }: UserServersProps) => {
  const router = useRouter();

  if (servers.length === 0) {
    return (
      <div className="text-zinc-500 text-sm p-4 bg-zinc-800/50 rounded-md">
        No servers to display.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {servers.map((server) => {
        const isOwner = ownedServers.some(owned => owned.id === server.id);
        
        return (
          <div
            key={server.id}
            className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-700/30 transition"
          >
            <div className="relative">
              <img
                src={server.serverImage}
                alt={server.name}
                className="h-12 w-12 rounded-full"
              />
              {isOwner && (
                <Crown size={14} className="absolute -bottom-1 -right-1 text-amber-500 bg-zinc-800 rounded-full p-[2px]" />
              )}
            </div>
            <div>
              <h4 className="font-semibold">{server.name}</h4>
              <p className="text-xs text-zinc-400">
                {isOwner ? "Owner" : "Member"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};