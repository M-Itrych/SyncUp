"use client"

import {useState} from "react";
import {IdCard} from "lucide-react";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

interface AppUserCopyProps {
    id: string;
}

export const AppUserCopy = ({id}: AppUserCopyProps) => {

    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }
    return (
        <DropdownMenuItem onClick={() => onCopy()}>
        <span className="text-md flex items-center justify-center gap-2 p-1" >
            <IdCard />
            Copy User ID
        </span>
        </DropdownMenuItem>
    )
}