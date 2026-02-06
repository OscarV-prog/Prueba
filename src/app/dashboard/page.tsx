"use client";

import { useEffect, useState } from "react";
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
import { useLanguage } from "~/providers/language-provider";

import { useSession } from "next-auth/react";
import { Briefcase, Plus, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session } = useSession();
    const { tasks, loading, fetchMyDayTasks, reorderTask } = useTasksStore();
    const { t, language } = useLanguage();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [skipped, setSkipped] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);

    const handleSkip = async () => {
        setIsSkipping(true);
        try {
            // Create or get Personal workspace
            const res = await fetch("/api/v1/workspaces/personal", {
                method: "POST",
            });

            if (res.ok) {
                const { workspaceId } = await res.json();

                // Switch to it
                await fetch("/api/v1/workspaces/active", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ workspaceId }),
                });

                // Force reload to update session
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to skip:", error);
            setIsSkipping(false);
        }
    };

    useEffect(() => {
        if (session?.user?.activeWorkspaceId) {
            void fetchMyDayTasks();
        }
    }, [fetchMyDayTasks, session?.user?.activeWorkspaceId]);

    // If no workspace active, show premium empty state
    if (!session?.user?.activeWorkspaceId && !loading && !skipped) {
        return (
            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-lg"
                >
                    {/* Background decorations */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white/40 p-12 text-center backdrop-blur-2xl shadow-2xl dark:border-gray-800 dark:bg-gray-950/40">
                        <button
                            onClick={handleSkip}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            title={t.dashboard.skip}
                        >
                            {isSkipping ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            )}
                        </button>

                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                            <Briefcase className="h-10 w-10 text-white" />
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                            {t.dashboard.noWorkspaceTitle}
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            {t.dashboard.noWorkspaceDesc}
                        </p>

                        <div className="mt-10 flex flex-col items-center space-y-4">
                            <Link
                                href="/onboarding"
                                className="group relative flex w-full items-center justify-center space-x-3 rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus className="h-5 w-5" />
                                <span>{t.common.createWorkspace}</span>
                                <Sparkles className="absolute right-6 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                            <p className="text-sm text-gray-400">
                                {t.dashboard.noWorkspaceQuote}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const overdueTasks = tasks.filter(
        (t) =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    );
    const todayTasks = tasks.filter((t) => !overdueTasks.includes(t));

    const handleDragEnd = async (event: DragEndEvent) => {
        // ... existing drag end logic ...
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
                        {t.dashboard.myDay}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 capitalize">
                        {new Date().toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
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
                                        {t.dashboard.overdue}
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
                                    {t.dashboard.today}
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
                                                {t.dashboard.allCaughtUp}
                                            </h3>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                {t.dashboard.enjoyDay}
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
