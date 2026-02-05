import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { tasksService } from "~/modules/tasks/tasks.service";
import { updateTaskSchema } from "~/modules/tasks/tasks.dto";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: taskId } = await params;
    const workspaceId = session.user.activeWorkspaceId;

    if (!workspaceId) return NextResponse.json({ message: "No active workspace" }, { status: 400 });

    try {
        const body = await req.json();
        const validatedData = updateTaskSchema.parse(body);

        const task = await tasksService.updateTask(taskId, workspaceId, validatedData);

        // Event triggers
        import("~/modules/events/app-events").then(({ appEvents, EVENTS }) => {
            if (validatedData.status === "DONE") {
                appEvents.emit(EVENTS.TASK_COMPLETED, { workspaceId, userId: session.user.id, taskId });
            } else {
                appEvents.emit(EVENTS.TASK_UPDATED, { workspaceId, userId: session.user.id, taskId });
            }
        });

        return NextResponse.json(task);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: taskId } = await params;
    const workspaceId = session.user.activeWorkspaceId;

    if (!workspaceId) return NextResponse.json({ message: "No active workspace" }, { status: 400 });

    try {
        await tasksService.deleteTask(taskId, workspaceId);
        return new Response(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
