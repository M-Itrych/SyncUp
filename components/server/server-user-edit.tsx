"use client";

import { useState } from "react";
import { Crown, Shield, UserRound, MoreHorizontal, UserMinus, UserCog } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Profile, Server, ServerMembership, User, Role } from "@prisma/client";
import { RoleDropdown } from "./role-dropdown";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ServerUserEditProps {
    member: ServerMembership & { 
        user: User & { profile: Profile | null }
        roles: Role[]
    },
    server: Server,
    serverRoles: Role[],
    isOwner: boolean,
    currentUserId: string
}

export const ServerUserEdit = ({
  member, 
  server, 
  serverRoles,
  isOwner,
  currentUserId
}: ServerUserEditProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const canEdit = isOwner || server.ownerId === currentUserId;
    const isServerOwner = member.userId === server.ownerId;
    const isSelf = member.userId === currentUserId;

    const handleKickMember = async () => {
      if (!canEdit || isServerOwner || isSelf) return;
      
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/server/${server.id}/members/${member.id}/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to remove member");
        }
        
        toast.success("Member removed from server");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    const handleViewProfile = () => {
      router.push(`/a/profile/${member.userId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full" asChild>
                <div className="flex items-center justify-between w-full p-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-lg cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                          src={member.user.profile?.avatarUrl ?? "/default-profile-image.png"}
                          alt={member.user.profile?.userName ?? "Unknown User"}
                          className="w-8 h-8 rounded-full"
                      />
                      {isServerOwner && (
                        <Crown size={12} className="absolute -bottom-1 -right-1 text-amber-500 bg-background rounded-full p-[2px]" />
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{member.user.profile?.userName ?? "Unknown User"}</p>
                      <div className="flex gap-1">
                        {isServerOwner && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] px-1 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                          >
                            Owner
                          </Badge>
                        )}
                        {member.roles.length > 0 ? (
                          member.roles.slice(0, isServerOwner ? 1 : 2).map((role) => (
                            <Badge 
                              key={role.id}
                              variant="outline" 
                              className="text-[10px] px-1 py-0 h-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-700"
                            >
                              {role.name}
                            </Badge>
                          ))
                        ) : (
                          !isServerOwner && <span className="text-xs text-zinc-500 dark:text-zinc-400">Member</span>
                        )}
                        {member.roles.length > (isServerOwner ? 1 : 2) && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] px-1 py-0 h-4 bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                          >
                            +{member.roles.length - (isServerOwner ? 1 : 2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={member.user.profile?.avatarUrl ?? "/default-profile-image.png"}
                            alt={member.user.profile?.userName ?? "Unknown User"}
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <h1 className="text-base font-semibold flex items-center gap-1">
                            {member.user.profile?.userName ?? "Unknown User"}
                            {isServerOwner && <Crown size={12} className="text-amber-500" />}
                          </h1>
                          <p className="text-xs text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {canEdit && (
                  <>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Manage Roles</span>
                        </DropdownMenuSubTrigger>
                        <RoleDropdown 
                          member={member}
                          server={server}
                          serverRoles={serverRoles}
                          isOwner={isOwner}
                        />
                    </DropdownMenuSub>
                    
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={handleViewProfile}
                >
                  <UserRound className="h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                
                {canEdit && !isServerOwner && !isSelf && (
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-rose-500 focus:text-rose-500"
                    onClick={handleKickMember}
                    disabled={isLoading}
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>Kick from Server</span>
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};