"use client";

import { useClerk } from "@clerk/nextjs";
import { DoorOpen } from "lucide-react";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

export const AppUserLogoutDropdown = () => {
    const { signOut } = useClerk();

    return (
        <DropdownMenuItem  onClick={() => signOut({ redirectUrl: '/login' })}>
            <span

                className="text-md flex items-center justify-center gap-2 p-1 text-rose-500 font-bold cursor-pointer"
            >
              <DoorOpen className="text-rose-500"/>
              Log Out
            </span>
        </DropdownMenuItem>
    );
};