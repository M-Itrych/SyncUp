"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Edit } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Server, Channel } from "@prisma/client";

interface EditChannelBtnProps {
    server?: Server;
    channel: Channel;
}

export const EditChannelBtn = ({ server, channel }: EditChannelBtnProps) => {
    const { onOpen } = useModal()
    
    return (
        <DropdownMenuItem 
            onClick={() => onOpen("editChannel", { channel })}
            className="px-3 py-2 text-sm cursor-pointer flex items-center gap-x-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md"
        >
            <Edit className="h-4 w-4" />
            Edit Channel
        </DropdownMenuItem>
    );
};