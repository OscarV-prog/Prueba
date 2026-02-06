
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check if user already has a Personal workspace
        const existingPersonal = await db.workspace.findFirst({
            where: {
                users: {
                    some: {
                        userId: session.user.id,
                        role: "OWNER",
                    },
                },
                name: "Personal",
            },
        });

        let workspaceId = existingPersonal?.id;

        if (!workspaceId) {
            // Create Personal Workspace
            const newWorkspace = await db.workspace.create({
                data: {
                    name: "Personal",
                    users: {
                        create: {
                            userId: session.user.id,
                            role: "OWNER",
                        },
                    },
                },
            });
            workspaceId = newWorkspace.id;
        }

        // Switch to this workspace
        // Update user's active workspace (if stored in DB, otherwise it's just a session/cookie thing?)
        // Actually, the session is JWT based usually, or database based. 
        // We need to invoke the same logic as the workspace switcher.
        // The switcher calls PATCH /api/v1/workspaces/active.
        // So we can just return the workspaceId and let the client handle the switch.
        // OR we can do it here if we want to be atomic.

        // Let's reuse the PATCH logic or just call it from the client.
        // Returning the ID is cleaner.

        return NextResponse.json({ workspaceId }, { status: 201 });

    } catch (error: any) {
        console.error("Failed to create personal workspace:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create personal workspace" },
            { status: 500 }
        );
    }
}
