"use client";

import { useState } from "react";
import { Profile, Server, ServerMembership, User, Role } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ServerUserEdit } from "./server-user-edit";

interface ServerMembersListProps {
  server: Server;
  members: (ServerMembership & {
    user: User & { profile: Profile | null };
    roles: Role[];
  })[];
  roles: Role[];
  currentUserId: string;
}

export const ServerUserList = ({
  server,
  members,
  roles,
  currentUserId
}: ServerMembersListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isOwner = server?.ownerId === currentUserId;
  const filteredMembers = members?.filter(member => {
    const username = member.user.profile?.userName || "";
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];
  
  const sortedMembers = filteredMembers.sort((a, b) => {
    if (a.user.id === server.ownerId) return -1;
    if (b.user.id === server.ownerId) return 1;
    if (a.roles.length !== b.roles.length) {
      return b.roles.length - a.roles.length;
    }
    const usernameA = a.user.profile?.userName || "";
    const usernameB = b.user.profile?.userName || "";
    return usernameA.localeCompare(usernameB);
  });

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-200/50 dark:bg-zinc-700/30 border-none focus-visible:ring-1 focus-visible:ring-violet-500"
        />
      </div>
      
      <div className="space-y-0.5">
        {sortedMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No members found
          </p>
        ) : (
          sortedMembers.map((member) => (
            <ServerUserEdit
              key={member.id}
              member={member}
              server={server}
              serverRoles={roles}
              isOwner={isOwner}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};