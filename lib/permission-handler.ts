import { db } from "./db";

export const hasPermission = async (userId: string, serverId: string, requiredPermission: string) => {
    const userMembership = await db.serverMembership.findFirst({
        where: {
            userId,
            serverId
        },
        include: {
            roles: true
        }
    });

    if (!userMembership) {
        return false;
    }
    const allPermissions = new Set(
        userMembership.roles.flatMap(role => role.permissions.split(","))
    );

    return allPermissions.has(requiredPermission);
};
