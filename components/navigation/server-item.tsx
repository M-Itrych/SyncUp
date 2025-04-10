"use client"

import Image from "next/image";
import {useParams, useRouter} from "next/navigation";


import {cn} from "@/lib/utils"
import {ActionTooltip} from "@/components/action-tooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

export const ServerItem = ({
                                   id,
                                   imageUrl,
                                   name,
                               }: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();
    const onClick = () => {
        router.replace(`/a/servers/${id}`);
    }

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick} className="group flex items-center justify-center w-full cursor-pointer">
                <div className={cn(
                    "absolute left-0 dark:bg-white bg-zinc-600 rounded-r-full transition-all",
                    params?.serverId !== id && "group-hover:h-[20px] group-hover:w-[4px]",
                    params?.serverId === id ? "h-[36px] w-[4px]" : "h-[8px]",
                )}/>
                <div className={cn(
                    "relative group flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-primary/10",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]",
                )}>
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                    />
                </div>
            </button>
        </ActionTooltip>
    )
}