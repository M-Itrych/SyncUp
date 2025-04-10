"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserPlus } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Server } from "@prisma/client";
interface InviteMenuItemProps {
    onClick?: () => void;
}


interface InviteBtnProps  {
    server: Server;
}

export const InviteBtn = ({ server }:InviteBtnProps) => {
    const { onOpen } = useModal()
    return (
        <DropdownMenuItem
            className="text-sm cursor-pointer hover:bg-violet-500 dark:hover:bg-violet-500/30 hover:text-white text-violet-500 transition-all duration-200 ease-in-out group"
            onClick={() => onOpen("invite", {server})}
        >
            Invite
            <UserPlus className="ml-auto text-voilet-500 group-hover:text-white duration-200 transition-all ease-in-out" />
        </DropdownMenuItem>
    );
};