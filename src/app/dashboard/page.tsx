"use client";

import { useEffect } from "react";
import { useTasksStore } from "~/stores/tasks.store";
import { QuickAdd } from "~/components/dashboard/quick-add";
import { ProgressBar } from "~/components/dashboard/progress-bar";
import { SortableTaskItem } from "~/components/dashboard/sortable-task-item";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateMidpoint } from "~/utils/fractional-indexing";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { tasks, loading, fetchMyDayTasks, reorderTask } = useTasksStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        void fetchMyDayTasks();
    }, [fetchMyDayTasks]);

    const overdueTasks = tasks.filter(
        (t) =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    );
    const todayTasks = tasks.filter((t) => !overdueTasks.includes(t));

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over.id);

            const newTasks = arrayMove(tasks, oldIndex, newIndex);

            const prevTask = newTasks[newIndex - 1] || null;
            const nextTask = newTasks[newIndex + 1] || null;

            const newDisplayOrder = generateMidpoint(
                prevTask?.displayOrder || null,
                nextTask?.displayOrder || null
            );

            reorderTask(active.id as string, newDisplayOrder);

            try {
                const res = await fetch(`/api/v1/tasks/${active.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ displayOrder: newDisplayOrder }),
                });
                if (!res.ok) throw new Error("Failed to persist order");
            } catch (error) {
                void fetchMyDayTasks();
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 sm:p-10">
            <div className="mx-auto max-w-3xl space-y-10">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        My Day
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </header>

                <div className="grid gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <ProgressBar />
                        <QuickAdd />
                    </motion.div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="space-y-10">
                            {overdueTasks.length > 0 && (
                                <section className="space-y-4">
                                    <h3 className="flex items-center text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                        Overdue
                                    </h3>
                                    <div className="space-y-3">
                                        <SortableContext
                                            items={overdueTasks.map((t) => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {overdueTasks.map((task) => (
                                                <SortableTaskItem key={task.id} task={task} />
                                            ))}
                                        </SortableContext>
                                    </div>
                                </section>
                            )}

                            <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Today
                                </h3>
                                <div className="space-y-3">
                                    {todayTasks.length > 0 ? (
                                        <SortableContext
                                            items={todayTasks.map((t) => t.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {todayTasks.map((task) => (
                                                <SortableTaskItem key={task.id} task={task} />
                                            ))}
                                        </SortableContext>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 py-16 text-center">
                                            <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-4">
                                                <svg
                                                    className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="mt-6 text-sm font-semibold text-gray-900 dark:text-white">
                                                You're all caught up!
                                            </h3>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Enjoy your productive day.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}
