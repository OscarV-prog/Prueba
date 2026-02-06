import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const activeWorkspaceSchema = z.object({
    workspaceId: z.string().cuid(),
});

export async function PATCH(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { workspaceId } = activeWorkspaceSchema.parse(body);

        // Verify user belongs to this workspace
        const membership = await db.userWorkspace.findUnique({
            where: {
                userId_workspaceId: {
                    userId: session.user.id,
                    workspaceId,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({ message: "You don't belong to this workspace" }, { status: 403 });
        }

        // Update active workspace
        await db.user.update({
            where: { id: session.user.id },
            data: { activeWorkspaceId: workspaceId },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ message: "Invalid workspace ID" }, { status: 400 });
        }
        console.error("Switch workspace error:", error);
        return NextResponse.json({ message: "Failed to switch workspace" }, { status: 500 });
    }
}
