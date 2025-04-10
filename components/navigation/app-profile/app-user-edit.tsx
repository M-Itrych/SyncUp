"use client";

import { Pencil } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const AppUserEdit = ({ username, avatarUrl, userId }: { username: string, avatarUrl: string, userId: string }) => {
    const router = useRouter();
    
    const handleEditProfile = () => {
        router.push(`/a/settings/profile/${userId}`);
    };

    return (
        <DropdownMenuItem onClick={handleEditProfile}>
            <span className="text-md flex items-center justify-center gap-2 p-1">
                <Pencil className="h-4 w-4" />
                Edit Profile
            </span>
        </DropdownMenuItem>
    );
};