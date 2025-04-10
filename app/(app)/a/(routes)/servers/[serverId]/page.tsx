import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import ServerWelcomePage from "@/components/chat-page-components/server-welcome-page";

interface ServerIdPageProps {
    params: {
        serverId: string;
    }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const user = await currentUser();
    
    if (!user) {
        return redirect("/");
    }
    
    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        },
        include: {
            owner: {
                include: {
                    profile: true
                }
            },
            members: {
                include: {
                    user: true
                }
            },
            channels: {
                include: {
                    messages: true
                }
            }
        }
    });
    
    if (!server) {
        return redirect("/");
    }
    
    return (
        <div>
            <ServerWelcomePage 
                server={server} 
                currentUser={user} 
            />
        </div>
    );
};

export default ServerIdPage;