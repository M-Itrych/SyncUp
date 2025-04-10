import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: { serverId: string } }
) {
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!params.serverId) {
        return new Response(JSON.stringify({ error: "Server ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const server = await db.server.findUnique({
            where: { id: params.serverId },
        });

        if (!server || server.ownerId !== user.id) {
            return new Response(
                JSON.stringify({ error: "Server not found or unauthorized" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        await db.server.delete({
            where: { id: params.serverId },
        });

        return new Response(
            JSON.stringify({ message: "Server deleted successfully" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Failed to delete server" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}