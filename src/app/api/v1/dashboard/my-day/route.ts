import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { dashboardService } from "~/modules/dashboard/dashboard.service";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = session.user.activeWorkspaceId;
    if (!workspaceId) {
        return NextResponse.json({ message: "No active workspace" }, { status: 400 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const timezone = searchParams.get("timezone") || "UTC";

        const data = await dashboardService.getMyDayTasks(
            session.user.id,
            workspaceId,
            timezone
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
