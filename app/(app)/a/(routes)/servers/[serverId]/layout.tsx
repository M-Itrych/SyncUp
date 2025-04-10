import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ServerSideBar } from "@/components/server/server-side-bar";
import { ServerUserList } from "@/components/server/server-user-list";
import { Construction } from "lucide-react";

const ServerIdLayout = async ({
    children,
    params,
}: { 
    children: React.ReactNode; 
    params: Promise<{ serverId: string }> 
}) => {
    const user = await currentUser();

    if (!user) {
        return redirect("/login");
    }
    const resolvedParams = await params;
    const serverId = resolvedParams.serverId;

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    userId: user.id
                }
            }
        },
        include: {
            members: {
                include: {
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    roles: true
                }
            }
        }
    });

    if (!server) {
        return redirect("/a");
    }

    const roles = await db.role.findMany({
        where: {
            serverId: server.id
        }
    });

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed bg-sky-50 dark:bg-zinc-900">
                <ServerSideBar serverId={serverId} />
            </div>
            <div className="min-[770px]:hidden fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 bg-opacity-95 z-50 flex flex-col items-center justify-center text-white p-6">
                <Construction className="text-amber-400 mb-4" size={64} strokeWidth={1.5} />
                <h1 className="text-4xl font-bold mb-2 text-center">Work in Progress</h1>
                <p className="text-lg text-center text-gray-200 max-w-xs">
                    We're building something awesome for you. Please check back soon!
                </p>
                <div className="mt-8 relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-2/3 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
            </div>
            
            <div className="flex flex-col">
                <main className="max-h-screen md:pl-60 md:pr-60 w-full">
                    {children}
                </main>
            </div>
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed top-0 right-0 bg-sky-50 dark:bg-zinc-900 border-l-1 dark:border-zinc-500/30">
                <ServerUserList 
                    server={server} 
                    members={server.members} 
                    roles={roles}
                    currentUserId={user.id}
                />
            </div>
        </div>
    );
};

export default ServerIdLayout;