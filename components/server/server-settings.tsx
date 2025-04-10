"use client"

import { Settings } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Server } from "@prisma/client"

interface ServerSettingsProps {
    server: Server
}


export const ServerSettingsBtn = ({server}:ServerSettingsProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/a/servers/${server.id}/settings`);
    }
    return (
        <DropdownMenuItem onClick={handleClick} className="text-sm cursor-pointer text-black dark:text-white dark:hover:text-white  transition-all duration-400 ease-in-out group ">
            Server settings
            <Settings className="ml-auto text-black dark:text-white dark:group-hover:text-white duration-200 transition-all ease-in-out"/>
        </DropdownMenuItem>
    )
}