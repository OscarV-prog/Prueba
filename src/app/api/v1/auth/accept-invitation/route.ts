import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { acceptInvitation, getInvitationByToken } from "~/modules/workspaces/invitations.service";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: "Token is required" }, { status: 400 });
        }

        const invitation = await acceptInvitation(token, session.user.id);

        return NextResponse.json({
            message: "Successfully joined workspace",
            workspaceId: invitation.workspaceId
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    try {
        const invitation = await getInvitationByToken(token);
        return NextResponse.json(invitation);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}
