import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permission-handler";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUserRound, Paintbrush, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerAppearanceForm } from "@/components/server/server-appearance-form";
import { ServerRolesForm } from "@/components/server/server-role-form";

interface SettingsPageProps {
  params: Promise<{
    serverId: string;
  }>;
  searchParams: Promise<{
    setting?: string;
  }>;
}

export default async function SettingsPage({ params, searchParams }: SettingsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const serverId = resolvedParams.serverId;
  const currentSetting = resolvedSearchParams?.setting || "appearance";

  const user = await currentUser();

  if(!user) {
    redirect("/");
    return null;
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    }
  });
  
  if(!server) {
    redirect("/");
    return null;
  }
  
  const isOwner = user?.id === server.ownerId;
  const canEdit = await hasPermission(user.id, serverId, "can_edit_server");
  const isAdmin = await hasPermission(user.id, serverId, "is_admin");

  if(!canEdit && !isAdmin && !isOwner) {
    redirect("/");
    return null;
  }
  const roles = await db.role.findMany({
    where: {
      serverId: server.id
    },
    orderBy: {
      name: 'asc'
    }
  });
  
  const members = await db.serverMembership.findMany({
    where: {
      serverId: server.id
    },
    include: {
      user: {
        include: {
          profile: true
        }
      },
      roles: true
    }
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-6 w-full text-center bg-zinc-900/60 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-100">Server Settings</h1>
        <p className="text-zinc-400 mt-1">
          Manage and customize your server
        </p>
      </div>
      
      <div className="flex-1 p-6">
        <Tabs defaultValue={currentSetting} className="w-full">
          <TabsList className="mb-6 bg-zinc-800/50 backdrop-blur-sm p-1 border border-zinc-700 rounded-md flex justify-center w-full max-w-md mx-auto">
            <TabsTrigger 
              value="appearance" 
              className="flex items-center gap-2 data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 transition-all duration-200"
            >
              <Paintbrush className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="roles" 
              className="flex items-center gap-2 data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 transition-all duration-200"
            >
              <ShieldAlert className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>
          
          <div className="max-w-4xl mx-auto w-full">
            <TabsContent value="appearance" className="mt-0 border-none p-0">
              <Card className="bg-zinc-900/50 border border-zinc-800">
                <CardContent>
                  <ServerAppearanceForm server={server} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="roles" className="mt-0 border-none p-0">
              <Card className="bg-zinc-900/50 border border-zinc-800">
                <CardContent>
                  <ServerRolesForm 
                    server={server} 
                    roles={roles} 
                    isOwner={isOwner} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}