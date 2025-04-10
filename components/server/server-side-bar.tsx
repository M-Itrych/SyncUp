import {currentUser} from "@/lib/current-user";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ServerMenu} from "@/components/server/server-menu";
import { ServerChannels } from "@/components/server/server-channels";

interface ServerSideBarProps {
    serverId: string;
}


export const ServerSideBar =  async ({serverId
}: ServerSideBarProps) => {
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
    })
    if (!server) {
        return redirect("/");
    }
    const user = await currentUser();

    if (!user) {
        return redirect("/")
    }


    return (
        <div className="flex flex-col h-full w-full ">
            <div className="select-none">
                <ServerMenu server={server}/>
            </div>
            <ServerChannels server={server}/>
        </div>
    );
};
