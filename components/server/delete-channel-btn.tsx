"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Channel } from "@prisma/client";
import { useRouter } from "next/navigation";

interface DeleteChannelBtnProps {
  channel: Channel;
}

export const DeleteChannelBtn = ({ channel }: DeleteChannelBtnProps) => {
  const { onOpen } = useModal();
  
  return (
    <DropdownMenuItem 
      onClick={() => onOpen("deleteChannel", { channel })}
      className="px-3 py-2 text-sm cursor-pointer flex items-center gap-x-2 text-red-500 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md"
    >
      <Trash className="h-4 w-4 text-red-500" />
      Delete Channel
    </DropdownMenuItem>
  );
};