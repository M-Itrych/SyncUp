import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";

interface ServerInviteProps {
  params: {
    serverInvite: string;
  };
}

const InviteCodePage = async ({ params }: ServerInviteProps) => {
  const profile = await currentUser();
  
  if (!profile) {
    redirect("/login");
    return null;
  }

  if (!params.serverInvite) {
    redirect("/");
    return null;
  }

  const existingServer = await db.server.findUnique({
    where: {
      serverInvite: params.serverInvite,
    },
    include: {
      members: true,
    },
  });

  if (!existingServer) {
    redirect("/");
    return null;
  }

  const isMember = existingServer.members.some(member => member.userId === profile.id);
  
  if (isMember) {
    redirect(`/a/servers/${existingServer.id}`);
    return null;
  }

  const updatedServer = await db.server.update({
    where: {
      serverInvite: params.serverInvite,
    },
    data: {
      members: {
        create: {
          userId: profile.id,
        },
      },
    },
  });

  redirect(`/a/servers/${updatedServer.id}`);
  return null;
};

export default InviteCodePage;