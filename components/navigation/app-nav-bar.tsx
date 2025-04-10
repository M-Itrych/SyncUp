import Image from "next/image";
import {PrivateMsgActionButton} from "@/components/navigation/private-msg-action-button";
import {ThemeSelector} from "@/components/theme-selector";
import {AddServerActionButton} from "@/components/navigation/add-server-action-button";
import {Separator} from "@/components/ui/separator";
import {AppUserProfile} from "@/components/navigation/app-profile/app-user-profile";
import {currentUser} from "@/lib/current-user";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ServerItem} from "@/components/navigation/server-item";

export const AppNavBar = async () => {
    const user = await currentUser()
    if (!user) {
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    })

    return (
        <div className="flex flex-col items-center h-full w-full gap-2 py-4 bg-sky-200 dark:bg-zinc-950">
            <PrivateMsgActionButton />
            <div className="px-4 w-full">
                <Separator className="!h-[2px] rounded-full" />
            </div>
            <AddServerActionButton/>
            <div className="flex-1 w-full overflow-hidden">
                <ScrollArea className="h-full w-full">
                    <div className="space-y-4">
                        {servers.map((server) => (
                            <div key={server.id} className="mb-4">
                                <ServerItem 
                                    id={server.id} 
                                    name={server.name} 
                                    imageUrl={server.serverImage}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <AppUserProfile />
            </div>
        </div>
    );
};
