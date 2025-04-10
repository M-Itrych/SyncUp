import {currentUser} from "@/lib/current-user";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    try {
        const {username, image} = await req.json();
        const user = await currentUser();

        if (!user) {
            return new NextResponse(`Unauthorized ${user}`, {status: 401});
        }

        const profile = await db.profile.create({
            data: {
                userId: user.id,
                userName: username,
                avatarUrl: image || "/default-profile-image.png"
            }
        })

        return NextResponse.json(profile);
    } catch (error) {
        console.log("[User POST]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH(req: Request) {
    try {
        const {username, image} = await req.json();
        const user = await currentUser();

        if (!user) {
            return new NextResponse(`Unauthorized`, {status: 401});
        }

        const existingProfile = await db.profile.findUnique({
            where: { userId: user.id }
        });

        if (!existingProfile) {
            return new NextResponse("Profile not found", {status: 404});
        }


        const profile = await db.profile.update({
            where: { userId: user.id },
            data: {
                userName: username,
                avatarUrl: image || "/default-profile-image.png",
            }
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.log("[User PATCH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
