import { db } from "~/server/db";

export async function listWorkspaceMembers(workspaceId: string) {
    const members = await db.userWorkspace.findMany({
        where: { workspaceId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return members;
}

export async function updateMemberRole(
    workspaceId: string,
    userId: string,
    newRole: "ADMIN" | "MEMBER",
    requestingUserId: string
) {
    // 1. Verify the requesting user is an ADMIN in that workspace
    const requester = await db.userWorkspace.findUnique({
        where: { userId_workspaceId: { userId: requestingUserId, workspaceId } },
    });

    if (!requester || requester.role !== "ADMIN") {
        throw new Error("Unauthorized: Only admins can manage roles");
    }

    // 2. If demoting an admin, check if they are the last one
    if (newRole === "MEMBER") {
        const adminCount = await db.userWorkspace.count({
            where: { workspaceId, role: "ADMIN" },
        });

        const targetUser = await db.userWorkspace.findUnique({
            where: { userId_workspaceId: { userId, workspaceId } },
        });

        if (targetUser?.role === "ADMIN" && adminCount <= 1) {
            throw new Error("Cannot demote the last admin in the workspace");
        }
    }

    // 3. Update the role
    return await db.userWorkspace.update({
        where: { userId_workspaceId: { userId, workspaceId } },
        data: { role: newRole },
    });
}
