import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { activityLogService } from "~/modules/activity/activity.service";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const workspaceId = session.user.activeWorkspaceId;
    if (!workspaceId) return NextResponse.json({ message: "No active workspace" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        const logs = await activityLogService.getLogs(workspaceId, limit, offset);
        return NextResponse.json(logs);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
