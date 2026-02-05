"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Plus, CheckCircle2, Zap, Clock, Loader2, LayoutGrid } from "lucide-react";
import { cn } from "~/lib/utils";

export function ActivityStream() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/v1/activity");
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } finally {
                setLoading(false);
            }
        };
        void fetchLogs();
    }, []);

    if (loading) return <div className="space-y-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex space-x-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 dark:bg-gray-900 rounded w-1/4" />
                </div>
            </div>
        ))}
    </div>;

    const getIcon = (type: string) => {
        switch (type) {
            case "TASK_CREATED": return <Plus className="h-4 w-4 text-indigo-500" />;
            case "TASK_COMPLETED": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            default: return <Zap className="h-4 w-4 text-amber-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    Pulse feed
                </h3>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-white" />
                </div>
            </div>

            <div className="flow-root overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                <ul className="-mb-8">
                    {logs.map((log, idx) => (
                        <li key={log.id}>
                            <div className="relative pb-8">
                                {idx !== logs.length - 1 && (
                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-100 dark:bg-gray-800" aria-hidden="true" />
                                )}
                                <div className="relative flex space-x-4">
                                    <div>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 ring-4 ring-white dark:ring-gray-900/50">
                                            {getIcon(log.actionType)}
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {log.user?.name || "User"}
                                                </span>{" "}
                                                {log.actionType.toLowerCase().replace("_", " ")}{" "}
                                                <span className="italic">
                                                    {log.metadata?.title || "item"}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="whitespace-nowrap text-right text-[10px] font-bold text-gray-400 dark:text-gray-600 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: false })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {logs.length === 0 && (
                        <div className="flex flex-col items-center py-10 opacity-50 grayscale">
                            <LayoutGrid className="h-10 w-10 mb-2" />
                            <p className="text-[10px] font-bold uppercase">Static Silence</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
