import { db } from "~/server/db";
import type { CreateInvitationDto } from "./invitations.dto";
import { randomBytes } from "crypto";

export async function createInvitation(
    workspaceId: string,
    invitedByUserId: string,
    dto: CreateInvitationDto
) {
    const { email, role } = dto;

    // Check if user is already in the workspace
    const existingMember = await db.userWorkspace.findUnique({
        where: {
            userId_workspaceId: {
                userId: invitedByUserId, // This is just a placeholder to check if the workspace exists and the user is an admin? 
                // Wait, I should check if the TARGET email is already in the workspace.
                workspaceId,
            },
        },
    });

    // Actually, we need to check if a user with that email is already in the workspace
    const userWithEmail = await db.user.findUnique({
        where: { email },
    });

    if (userWithEmail) {
        const isMember = await db.userWorkspace.findUnique({
            where: {
                userId_workspaceId: {
                    userId: userWithEmail.id,
                    workspaceId,
                },
            },
        });

        if (isMember) {
            throw new Error("User is already a member of this workspace");
        }
    }

    // Generate unique token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    try {
        const invitation = await db.invitation.create({
            data: {
                email,
                role,
                token,
                workspaceId,
                invitedByUserId,
                expiresAt,
            },
        });

        return invitation;
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error("A pending invitation already exists for this email");
        }
        throw new Error("Failed to create invitation");
    }
}

export async function getInvitationByToken(token: string) {
    const invitation = await db.invitation.findUnique({
        where: { token },
        include: { workspace: true },
    });

    if (!invitation) {
        throw new Error("Invalid invitation token");
    }

    if (invitation.status !== "PENDING") {
        throw new Error("Invitation has already been " + invitation.status.toLowerCase());
    }

    if (invitation.expiresAt < new Date()) {
        throw new Error("Invitation has expired");
    }

    return invitation;
}

export async function acceptInvitation(token: string, userId: string) {
    const invitation = await getInvitationByToken(token);

    return await db.$transaction(async (tx) => {
        // 1. Join user to workspace
        await tx.userWorkspace.create({
            data: {
                userId,
                workspaceId: invitation.workspaceId,
                role: invitation.role,
            },
        });

        // 2. Update user's active workspace
        await tx.user.update({
            where: { id: userId },
            data: { activeWorkspaceId: invitation.workspaceId },
        });

        // 3. Mark invitation as accepted
        await tx.invitation.update({
            where: { id: invitation.id },
            data: { status: "ACCEPTED" },
        });

        return invitation;
    });
}

export async function listInvitations(workspaceId: string) {
    return await db.invitation.findMany({
        where: {
            workspaceId,
            status: "PENDING",
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" },
    });
}
