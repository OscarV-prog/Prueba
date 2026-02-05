import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { teamService } from "~/modules/team/team.service";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const workspaceId = session.user.activeWorkspaceId;
    if (!workspaceId) return NextResponse.json({ message: "No active workspace" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const assigneeId = searchParams.get("assigneeId") || undefined;
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const search = searchParams.get("search") || undefined;

    try {
        const tasks = await teamService.getTeamOverview(workspaceId, {
            assigneeId,
            status,
            priority,
            search
        });

        // Also include stats
        const stats = await teamService.getWorkloadStats(workspaceId);

        return NextResponse.json({ tasks, stats });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
