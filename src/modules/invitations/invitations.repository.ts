import { db } from "~/server/db";

export const invitationsRepository = {
    async create(data: {
        workspaceId: string;
        email: string;
        role: string;
        token: string;
        invitedByUserId: string;
        expiresAt: Date;
    }) {
        return await db.invitation.create({
            data,
        });
    },

    async findByToken(token: string) {
        return await db.invitation.findUnique({
            where: { token },
            include: {
                workspace: true,
            },
        });
    },

    async updateStatus(id: string, status: string) {
        return await db.invitation.update({
            where: { id },
            data: { status },
        });
    },

    async findPendingByWorkspace(workspaceId: string) {
        return await db.invitation.findMany({
            where: {
                workspaceId,
                status: "PENDING",
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });
    },
};
