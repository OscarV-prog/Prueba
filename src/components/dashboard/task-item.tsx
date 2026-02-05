"use client";

import { useTasksStore } from "~/stores/tasks.store";
import { type TaskResponseDto } from "~/modules/tasks/tasks.dto";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Circle, GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";

export function TaskItem({
    task,
    dragHandleProps
}: {
    task: TaskResponseDto;
    dragHandleProps?: any;
}) {
    const updateTask = useTasksStore((state) => state.updateTask);

    const toggleComplete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = task.status === "DONE" ? "TODO" : "DONE";

        updateTask(task.id, { status: newStatus });

        try {
            const res = await fetch(`/api/v1/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");
        } catch (error) {
            updateTask(task.id, { status: task.status });
        }
    };

    const isDone = task.status === "DONE";

    const priorityColors = {
        HIGH: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
        MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
        LOW: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
    };

    return (
        <div className={cn(
            "group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-indigo-500/5",
            isDone && "opacity-60"
        )}>
            <div className="flex items-center space-x-4 min-w-0">
                <div
                    {...dragHandleProps}
                    className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </div>

                <button
                    onClick={toggleComplete}
                    className="flex-shrink-0 transition-transform active:scale-90"
                >
                    {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                        <Circle className="h-6 w-6 text-gray-300 hover:text-indigo-500 dark:text-gray-600 dark:hover:text-indigo-400" />
                    )}
                </button>

                <div className="min-w-0">
                    <h4 className={cn(
                        "text-sm font-medium transition-all truncate",
                        isDone ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-gray-100"
                    )}>
                        {task.title}
                    </h4>
                    <div className="mt-1 flex items-center space-x-3 text-xs">
                        <span className={cn(
                            "rounded px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]",
                            priorityColors[task.priority as keyof typeof priorityColors] || "bg-gray-50 dark:bg-gray-800"
                        )}>
                            {task.priority}
                        </span>
                        {task.dueDate && (
                            <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>{format(new Date(task.dueDate), "MMM d")}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
