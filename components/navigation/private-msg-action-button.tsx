"use client";

import Image from "next/image";
import {ActionTooltip} from "@/components/action-tooltip";
import {redirect} from "next/navigation";

export const PrivateMsgActionButton = () => {
    return (
        <ActionTooltip side="right" align="center" label="Private Messages">
            <div className="group" onClick={() => {
                redirect(`/a/@me`);
            }}>
                <div className="flex items-center justify-center bg-white dark:bg-zinc-800 p-1 w-[40px] h-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border hover:border-sky-600 duration-500 ease-in-out">
                    <Image src="/logo.png" alt="appLogo" width={48} height={48} />
                </div>
            </div>
        </ActionTooltip>
    )
}