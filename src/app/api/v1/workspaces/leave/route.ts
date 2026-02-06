import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST() {
    const session = await auth();

    if (!session?.user?.id || !session.user.activeWorkspaceId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = session.user.id;
        const workspaceId = session.user.activeWorkspaceId;

        // Verify it's not the last admin? (Optional but good practice)
        // For now, simple leave logic

        await db.userWorkspace.delete({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId,
                },
            },
        });

        // Clear active workspace
        await db.user.update({
            where: { id: userId },
            data: { activeWorkspaceId: null },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Leave workspace error:", error);
        return NextResponse.json({ message: "Failed to leave workspace" }, { status: 500 });
    }
}
