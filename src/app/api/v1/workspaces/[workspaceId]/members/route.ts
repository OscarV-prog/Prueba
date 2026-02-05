import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { listWorkspaceMembers, updateMemberRole } from "~/modules/workspaces/members.service";

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
        const result = await listWorkspaceMembers(workspaceId);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    const session = await auth();
    const { workspaceId } = await params;

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ message: "User ID and Role are required" }, { status: 400 });
        }

        if (role !== "ADMIN" && role !== "MEMBER") {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const result = await updateMemberRole(workspaceId, userId, role, session.user.id);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}
