import { invitationsRepository } from "./invitations.repository";
import { db } from "~/server/db";
import * as cryptoNode from "crypto";

export const invitationsService = {
    async createInvitation(
        workspaceId: string,
        invitedByUserId: string,
        email: string,
        role: "ADMIN" | "MEMBER" = "MEMBER"
    ) {
        const token = cryptoNode.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        return await invitationsRepository.create({
            workspaceId,
            email,
            role,
            token,
            invitedByUserId,
            expiresAt,
        });
    },

    async acceptInvitation(userId: string, token: string) {
        const invitation = await invitationsRepository.findByToken(token);

        if (!invitation) {
            throw new Error("Invitation not found");
        }

        if (invitation.status !== "PENDING") {
            throw new Error("Invitation already used or revoked");
        }

        if (invitation.expiresAt < new Date()) {
            throw new Error("Invitation expired");
        }

        return await db.$transaction(async (tx) => {
            // 1. Link User to Workspace
            await tx.userWorkspace.create({
                data: {
                    userId,
                    workspaceId: invitation.workspaceId,
                    role: invitation.role,
                },
            });

            // 2. Update User's activeWorkspaceId
            await tx.user.update({
                where: { id: userId },
                data: { activeWorkspaceId: invitation.workspaceId },
            });

            // 3. Update Invitation status
            await tx.invitation.update({
                where: { id: invitation.id },
                data: { status: "ACCEPTED" },
            });

            return invitation.workspace;
        });
    },

    async getPendingInvitations(workspaceId: string) {
        return await invitationsRepository.findPendingByWorkspace(workspaceId);
    },
};
