"use client"
import {ActionTooltip} from "@/components/action-tooltip";
import {Plus} from "lucide-react";
import {useModal} from "@/hooks/use-modal"

export const AddServerActionButton = () => {
    const {onOpen} = useModal();
    return (
        <div>
                <ActionTooltip side="right" align="center" label="Add a server">
                    <div onClick={() => onOpen("createServer")} className="group cursor-pointer">
                        <button  className="group flex items-center justify-center border-0 bg-transparent"/>
                        <div className="flex items-center justify-center bg-background dark:bg-zinc-800 group-hover:dark:bg-violet-500 group-hover:bg-violet-500 w-[40px] h-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border hover:border-sky-600 duration-500 ease-in-out">
                            <Plus  className="group-hover:text-white transition text-violet-500" size={25}/>
                        </div>
                    </div>
                </ActionTooltip>
        </div>
    );
};
