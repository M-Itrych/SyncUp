import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDown, MessageSquare, Settings, Trash, Trash2, UserPlus, UserRoundPlusIcon,} from "lucide-react";
import {currentUser} from "@/lib/current-user";
import {Server} from "@prisma/client";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";
import { redirect } from "next/navigation";
import { InviteBtn } from "./invite-btn";
import { CreateChannelBtn } from "./create-channel-btn";
import { ServerSettingsBtn } from "./server-settings";
import { LeaveServerBtn } from "./leave-server-btn";
import { DeleteServerBtn } from "./delete-server-btn";

interface ServerMenuProps {
    server: Server;
}

export const ServerMenu = async ({server}: ServerMenuProps) => {
    const user = await currentUser();
    
    if(!user) {
        return redirect("/");
    }
    
    const isOwner = user.id === server.ownerId;

    const canInvite = await hasPermission(user.id, server.id, "can_invite") || 
                      await hasPermission(user.id, server.id, "is_admin") || 
                      isOwner;
    
    const canCreateChannels = await hasPermission(user.id, server.id, "can_create_channels") || 
                             await hasPermission(user.id, server.id, "is_admin") || 
                             isOwner;
    
    const canEditServer = await hasPermission(user.id, server.id, "can_edit_server") || 
                          await hasPermission(user.id, server.id, "is_admin") || 
                          isOwner;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center h-12 text-md font-semibold px-3 border-b-1 dark:border-zinc-500/30 cursor-pointer">
                    {server.name}
                    <ChevronDown className="ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-xs w-60">
                {canInvite && (
                    <InviteBtn server={server}/>
                )}
                {canCreateChannels && (
                    <CreateChannelBtn server={server}/>
                )}
                {canEditServer && (
                    <ServerSettingsBtn server={server} />
                )}
                {!isOwner && (
                    <LeaveServerBtn server={server}/>
                )}
                {isOwner && (
                    <DeleteServerBtn server={server}/>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};