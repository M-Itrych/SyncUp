import {currentUser} from '@clerk/nextjs/server'
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

export const initialUser = async () => {
    const user = await currentUser();

    if (!user) {
        console.log("User not found!");
        redirect('/login')
    }

    const profile = await db.user.findUnique({
        where: {
            clerkId: user.id
        }
    });

    if (profile) {
        return profile;
    }

    return db.user.create({
        data: {
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
        }
    });
}