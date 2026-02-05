import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { invitationsService } from "~/modules/invitations/invitations.service";
import { z } from "zod";

const acceptSchema = z.object({
    token: z.string().min(1),
});

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { token } = acceptSchema.parse(body);

        const workspace = await invitationsService.acceptInvitation(session.user.id, token);

        return NextResponse.json(workspace);
    } catch (error: any) {
        console.error("Accept invite error:", error);
        return NextResponse.json({ message: error.message || "Failed to join team" }, { status: 500 });
    }
}
