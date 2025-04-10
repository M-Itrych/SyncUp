"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Server } from "@prisma/client";
interface CreateChannelItemProps {
    onClick?: () => void;
}


interface CreateChannelBtnProps  {
    server: Server;
}

export const CreateChannelBtn = ({ server }:CreateChannelBtnProps) => {
    const { onOpen } = useModal()
    return (
        <DropdownMenuItem className="text-sm cursor-pointer text-black dark:text-white dark:hover:text-white  transition-all duration-400 ease-in-out group  "
        onClick={() => onOpen("createChannel", {server})}
            >
                        Create channel
                        <Settings className="ml-auto text-black dark:text-white dark:group-hover:text-white duration-200 transition-all ease-in-out"/>
                    </DropdownMenuItem>
    );
};