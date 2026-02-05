"use client";

import { useTasksStore } from "~/stores/tasks.store";
import { motion } from "framer-motion";

export function ProgressBar() {
    const tasks = useTasksStore((state) => state.tasks);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "DONE").length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Focus Progress</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {completed} of {total} tasks completed
                    </p>
                </div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {percentage}%
                </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                />
            </div>

            {percentage === 100 && total > 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-xs font-medium text-green-600 dark:text-green-400"
                >
                    🌟 You've mastered your day!
                </motion.p>
            )}
        </div>
    );
}
