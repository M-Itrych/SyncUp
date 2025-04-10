"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {  Trash2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Server } from "@prisma/client";
interface DeleteServerItemProps {
    onClick?: () => void;
}


interface DeleteServerBtnProps  {
    server: Server;
}

export const DeleteServerBtn = ({ server }:DeleteServerBtnProps) => {
    const { onOpen } = useModal()
    return (
        <DropdownMenuItem className="  text-red-600 dark:text-red-500 text-sm cursor-pointer   hover:bg-red-500 dark:hover:bg-red-500/30 hover:text-white  transition-all duration-200 ease-in-out group  "
        onClick={() => onOpen("deleteServer", { server })}> 
                        Delate server
                        <Trash2  className="ml-auto  text-red-600 dark:text-red-500  group-hover:text-white duration-200 transition-all ease-in-out"/>
                    </DropdownMenuItem>
    );
};