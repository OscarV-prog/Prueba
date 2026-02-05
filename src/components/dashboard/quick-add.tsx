"use client";

import { useState } from "react";
import { useTasksStore } from "~/stores/tasks.store";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export function QuickAdd() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const addTask = useTasksStore((state) => state.addTask);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle || loading) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: trimmedTitle,
                    priority: "MEDIUM",
                    status: "TODO",
                    dueDate: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create task");
            }
            const task = await res.json();
            addTask(task);
            setTitle("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <input
                type="text"
                placeholder="Add a task for Today..."
                className={cn(
                    "w-full rounded-2xl border border-gray-200 bg-white/50 px-6 py-4 pl-12 shadow-sm backdrop-blur-sm transition-all",
                    "focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
                    "dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-500",
                    "dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
            />
            <div className="absolute inset-y-0 left-4 flex items-center">
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                ) : (
                    <Plus className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                )}
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
                {title.trim() && (
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                        Enter
                    </kbd>
                )}
            </div>
        </form>
    );
}
