import { currentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        let { serverName, serverImage } = await req.json();
        
        const user = await currentUser();

        if (serverImage === "") {
            serverImage = "/default-server-image.png";
        }

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                ownerId: user.id,
                name: serverName,
                serverImage: serverImage,
                members: {
                    create: {
                        userId: user.id,
                    },
                },
                channels: {
                    create: [
                        {
                            name: "General",
                            type: "TEXT",
                        },
                    ],
                },
            },
            include: {
                members: true,
            },
        });

        return NextResponse.json(server);
    } catch (err) {
        console.log("[Server POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
