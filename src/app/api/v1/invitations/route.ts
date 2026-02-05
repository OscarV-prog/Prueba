import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { invitationsService } from "~/modules/invitations/invitations.service";
import { z } from "zod";

const inviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.activeWorkspaceId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email, role } = inviteSchema.parse(body);

        const invitation = await invitationsService.createInvitation(
            session.user.activeWorkspaceId,
            session.user.id,
            email,
            role
        );

        return NextResponse.json(invitation, { status: 201 });
    } catch (error: any) {
        console.error("Invite error:", error);
        return NextResponse.json({ message: error.message || "Failed to invite member" }, { status: 500 });
    }
}

export async function GET() {
    const session = await auth();

    if (!session?.user?.activeWorkspaceId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const invitations = await invitationsService.getPendingInvitations(session.user.activeWorkspaceId);
    return NextResponse.json(invitations);
}
