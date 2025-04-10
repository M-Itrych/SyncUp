import {initialUser} from "@/lib/initial-user";
import {ProfileModal} from "@/components/modals/profile-modal";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

export default async function  AppPage() {
    const user = await initialUser();


    const profile = await db.profile.findFirst({
        where: {
            userId: user.id
        }
    })

    if (profile) {
        return redirect(`/a/@me`);
    }

    return (
        <div>
            <ProfileModal />
        </div>
    )
}