"use client"

import { useParams, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu"
import { EditChannelBtn } from "./edit-chanel-btn"
import { DeleteChannelBtn } from "./delete-channel-btn"
import { Channel, Server } from "@prisma/client"

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
}

export const ServerChannel = ({ channel, server }: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push(`/a/servers/${params?.serverId}/channels/${channel.id}`)
  }

  return (
    <div 
      className="hover:bg-white/10 p-2 rounded-md text-sm flex items-center justify-between group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span># &nbsp;</span>
        {channel.name}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none opacity-0 group-hover:opacity-100" asChild>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Channel actions</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2Z" fill="currentColor" className="text-zinc-500" />
              <path d="M8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7Z" fill="currentColor" className="text-zinc-500" />
              <path d="M7 13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13Z" fill="currentColor" className="text-zinc-500" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-48 p-1">
          <EditChannelBtn channel={channel} server={server} />
          <DeleteChannelBtn channel={channel}  />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}