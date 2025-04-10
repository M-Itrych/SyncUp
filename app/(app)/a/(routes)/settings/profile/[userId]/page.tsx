// app/settings/profile/[userId]/page.tsx
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";

interface ProfileEditPageProps {
  params: {
    userId: string;
  };
}

export default async function ProfileEditPage({ params }: ProfileEditPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }
  if (user.id !== params.userId) {
    redirect("/");
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: params.userId,
    },
  });

  if (!profile) {
    return (
      <div className="h-full p-6 flex flex-col gap-6">
        <div className="mb-2">
          <BackButton />
        </div>
        <div className="max-w-3xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6">Create Your Profile</h1>
          <ProfileEditForm 
            initialData={{
              id: "",
              userId: user.id,
              userName: "",
              bio: "",
              avatarUrl: ""
            }}
            isNew={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      <div className="mb-2">
        <BackButton />
      </div>
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <ProfileEditForm initialData={profile} isNew={false} />
      </div>
    </div>
  );
}