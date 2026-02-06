import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const workspaceSchema = z.object({
    name: z.string().min(1).max(50),
});

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const workspaces = await db.workspace.findMany({
            where: {
                users: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(workspaces);
    } catch (error) {
        console.error("Fetch workspaces error:", error);
        return NextResponse.json({ message: "Failed to fetch workspaces" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = workspaceSchema.parse(body);

        const result = await db.$transaction(async (tx) => {
            // 1. Create Workspace
            const workspace = await tx.workspace.create({
                data: { name },
            });

            // 2. Link User to Workspace
            await tx.userWorkspace.create({
                data: {
                    userId: session.user.id,
                    workspaceId: workspace.id,
                    role: "ADMIN",
                },
            });

            // 3. Update User's activeWorkspaceId
            await tx.user.update({
                where: { id: session.user.id },
                data: { activeWorkspaceId: workspace.id },
            });

            return workspace;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ message: "Invalid workspace name" }, { status: 400 });
        }
        console.error("Workspace creation error:", error);
        return NextResponse.json({ message: "Failed to create workspace" }, { status: 500 });
    }
}
