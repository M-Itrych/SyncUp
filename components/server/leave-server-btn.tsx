"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { Server } from "@prisma/client";
import { Trash } from "lucide-react";
interface LeaveServerItemProps {
    onClick?: () => void;
}


interface LeaveServerBtnProps  {
    server: Server;
}

export const LeaveServerBtn = ({ server }:LeaveServerBtnProps) => {
    const { onOpen } = useModal()
    return (
        <DropdownMenuItem className="text-red-500 text-sm cursor-pointer  hover:bg-red-500/30 hover:text-white  transition-all duration-200 ease-in-out group  "
                        onClick={ () => onOpen("leaveServer", {server})}>
                        Leave server
                        <Trash  className="ml-auto text-red-500  duration-200 transition-all ease-in-out"/>
                    </DropdownMenuItem>
    );
};