import {db} from "@/lib/db";
import {currentUser} from "@/lib/current-user";
import {redirect} from "next/navigation";
import Image from "next/image";
import {
    DropdownMenuContent,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {IdCard, Pencil} from "lucide-react";
import {AppUserLogoutDropdown} from "@/components/navigation/app-profile/app-user-logout-dropdown";
import {AppUserCopy} from "@/components/navigation/app-profile/app-user-copy";
import {AppUserEdit} from "@/components/navigation/app-profile/app-user-edit";

export const AppUserProfile = async () => {
    const user = await currentUser()

    if (!user) {
        return redirect("/login");
    }


    const profile = await db.profile.findFirst({
        where: {
            userId: user.id
        }
    })

    if (!profile) {
        return (
            <Image
                src={"/default-profile-image.png"}
                alt="UserImage"
                width={48} height={48}
                className="flex items-center justify-center bg-background dark:bg-zinc-800 group-hover:dark:bg-violet-500 group-hover:bg-violet-500 w-[40px] h-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border hover:border-sky-600 duration-500 ease-in-out"/>

        );
    }



    return (
        <div className="group cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Image
                        src={profile.avatarUrl ?? "/default-profile-image.png"}
                        alt="UserImage"
                        width={48} height={48}
                        className="flex items-center justify-center bg-background dark:bg-zinc-800 group-hover:dark:bg-violet-500 group-hover:bg-violet-500 w-[40px] h-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden border hover:border-sky-600 duration-500 ease-in-out"/>

                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="flex flex-col gap-2">
                        <div className="flex items-end gap-4 w-full">
                            <Image src={profile.avatarUrl ?? "/default-profile-image.png"}
                                   alt="UserImage"
                                   width={48} height={48} className="rounded-lg"/>
                        </div>
                        <h1 className="text-3xl font-semibold">{profile.userName}</h1>
                        <div className="flex flex-col gap-1">
                            <p className="text-black/50 dark:text-white/50">{user.createdAt.toLocaleDateString('en-GB')}</p>

                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AppUserEdit username={profile.userName} userId={profile.userId} avatarUrl={profile.avatarUrl ?? "/default-profile-image.png"}/>
                    <AppUserCopy id={profile.userId} />
                    <DropdownMenuSeparator />
                        <AppUserLogoutDropdown />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}