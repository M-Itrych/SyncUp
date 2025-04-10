import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserServers } from "@/components/profile/user-servers";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";


interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: params.userId,
    },
    include: {
      user: {
        include: {
          servers: {
            include: {
              server: true,
              roles: true,
            },
          },
          ownedServers: true,
        },
      },
    },
  });

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-zinc-500">Profile not found</h1>
        <p className="text-zinc-400">The user you're looking for doesn't exist or hasn't set up their profile.</p>
      </div>
    );
  }
  const visibleServers = await db.server.findMany({
    where: {
      OR: [
        {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        {
          ownerId: params.userId,
        },
      ],
    },
  });

  const isCurrentUser = user.id === params.userId;

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      <div className="mb-2">
        <BackButton />
      </div>
      <Card className="bg-zinc-900/80 border border-zinc-800">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="relative h-20 w-20">
            <img
              src={profile.avatarUrl ?? "/default-profile-image.png"}
              alt={profile.userName}
              className="rounded-full object-cover w-full h-full border-2 border-violet-600"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold">{profile.userName}</CardTitle>
              {isCurrentUser && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-600">
                  You
                </Badge>
              )}
            </div>
            <CardDescription className="text-zinc-400">
              Joined {new Date(profile.user.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator className="bg-zinc-700" />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-zinc-400">{profile.bio || "No bio provided."}</p>
            </div>
            
            <Separator className="bg-zinc-700 my-4" />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Servers</h3>
              <UserServers 
                servers={visibleServers}
                ownedServers={profile.user.ownedServers} 
                userId={params.userId}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}