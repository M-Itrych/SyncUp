import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        if (!params.serverId) {
            return new Response('Server ID is required', { status: 400 });
        }

        const server = await db.server.update({
            where: { id: params.serverId },
            data: {
                serverInvite: uuidv4(),
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error("Error updating server invite:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}