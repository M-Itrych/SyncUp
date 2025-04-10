"use client";

import { useState } from "react";
import { Check, CheckCheck, Crown, Shield } from "lucide-react";
import { 
  DropdownMenuItem,
  DropdownMenuSubContent 
} from "@/components/ui/dropdown-menu";
import { Profile, Server, ServerMembership, User, Role } from "@prisma/client";
import { toast } from "sonner";

interface RoleDropdownProps {
    member: ServerMembership & { 
        user: User & { profile: Profile | null }
        roles: Role[]
    },
    server: Server,
    serverRoles: Role[],
    isOwner: boolean
}

export const RoleDropdown = ({
    member,
    server,
    serverRoles,
    isOwner
}: RoleDropdownProps) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const updateMemberRole = async (roleId: string) => {
        try {
            setIsLoading(true);
            const hasRole = member.roles.some(role => role.id === roleId);
            
            const url = hasRole 
                ? `/api/server/${server.id}/members/${member.id}/roles/${roleId}/remove`
                : `/api/server/${server.id}/members/${member.id}/roles/${roleId}/add`;
            
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) {
                throw new Error("Failed to update role");
            }
            toast.success(hasRole 
                ? "Role removed successfully" 
                : "Role assigned successfully"
            );
            
            window.location.reload();
            
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    const isServerOwner = member.userId === server.ownerId;
    
    return (
        <DropdownMenuSubContent className="w-48">
            {serverRoles && serverRoles.map((role) => {
                const hasRole = member.roles.some(memberRole => memberRole.id === role.id);
                
                return (
                    <DropdownMenuItem
                        key={role.id}
                        className="flex items-center justify-between px-3 py-2 cursor-pointer"
                        onClick={() => updateMemberRole(role.id)}
                        disabled={isLoading || (!isOwner && role.name === "Admin") || isServerOwner}
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5 text-violet-500" />
                            <span className="text-sm font-medium">{role.name}</span>
                        </div>
                        {hasRole && <Check className="h-4 w-4 text-violet-500" />}
                    </DropdownMenuItem>
                );
            })}
            
            <DropdownMenuItem 
                className="flex items-center justify-between px-3 py-2"
                disabled={true}
            >
                <div className="flex items-center gap-2">
                    <CheckCheck className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm font-medium">Member</span>
                </div>
                <Check className="h-4 w-4 text-violet-500"/>
            </DropdownMenuItem>
            
            {isServerOwner && (
                <DropdownMenuItem 
                    className="flex items-center justify-between px-3 py-2"
                    disabled={true}
                >
                    <div className="flex items-center gap-2">
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-sm font-medium">Owner</span>
                    </div>
                    <Check className="h-4 w-4 text-amber-500"/>
                </DropdownMenuItem>
            )}
        </DropdownMenuSubContent>
    );
};