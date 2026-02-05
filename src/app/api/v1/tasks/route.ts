import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { tasksService } from "~/modules/tasks/tasks.service";
import { createTaskSchema } from "~/modules/tasks/tasks.dto";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = session.user.activeWorkspaceId;
    if (!workspaceId) {
        return NextResponse.json(
            { message: "No active workspace selected. Please complete onboarding." },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const validatedData = createTaskSchema.parse(body);

        const task = await tasksService.createTask(session.user.id, workspaceId, validatedData);

        // Non-blocking event trigger
        import("~/modules/events/app-events").then(({ appEvents, EVENTS }) => {
            appEvents.emit(EVENTS.TASK_CREATED, {
                workspaceId,
                userId: session.user.id,
                taskId: task.id,
                title: task.title
            });
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation failed", errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = session.user.activeWorkspaceId;
    if (!workspaceId) {
        return NextResponse.json(
            { message: "No active workspace selected" },
            { status: 400 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || undefined;
        const assigneeId = searchParams.get("assigneeId") || undefined;

        const tasks = await tasksService.getTasks(workspaceId, { status, assigneeId });
        return NextResponse.json(tasks);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "An error occurred" },
            { status: 400 }
        );
    }
}
