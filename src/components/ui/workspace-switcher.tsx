"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    ChevronDown,
    Plus,
    Check,
    Briefcase,
    Loader2,
    Settings,
    Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";
import { useLanguage } from "~/providers/language-provider";

interface Workspace {
    id: string;
    name: string;
    _count?: {
        users: number;
    };
}

export function WorkspaceSwitcher() {
    const { data: session, update } = useSession();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [switching, setSwitching] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user) return;

        const fetchWorkspaces = async () => {
            try {
                const res = await fetch("/api/v1/workspaces");
                if (res.ok) {
                    const data = await res.json();
                    setWorkspaces(data);
                }
            } catch (error) {
                console.error("Failed to fetch workspaces", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, [session?.user]);

    const activeWorkspace = workspaces.find(w => w.id === session?.user?.activeWorkspaceId);

    const handleSwitch = async (id: string) => {
        if (id === session?.user?.activeWorkspaceId) return;

        setSwitching(id);
        try {
            const res = await fetch("/api/v1/workspaces/active", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workspaceId: id }),
            });

            if (res.ok) {
                await update({ activeWorkspaceId: id });
                setIsOpen(false);
                // Hard redirect to refresh all server components with new context
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Failed to switch workspace", error);
        } finally {
            setSwitching(null);
        }
    };

    if (!session?.user) {
        console.log("WS: No session");
        return <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-xl dark:bg-gray-800" />;
    }

    const getWorkspaceDisplayName = (name: string | undefined) => {
        if (!name) return t.common.selectWorkspace || "Workspace";
        return name === "Personal" ? t.common.personalSpace : name;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center space-x-2 rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm font-semibold transition-all hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-950/50 dark:hover:bg-gray-900",
                    isOpen && "ring-2 ring-indigo-500/20 shadow-md"
                )}
            >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Briefcase className="h-3.5 w-3.5" />
                </div>
                <span className="max-w-[120px] truncate text-gray-700 dark:text-gray-200">
                    {getWorkspaceDisplayName(activeWorkspace?.name)}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute left-0 mt-2 z-20 w-64 origin-top-left rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
                        >
                            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {t.common.workspaces || "Workspaces"}
                            </div>

                            <div className="mt-1 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    workspaces.map((workspace, idx) => (
                                        <button
                                            key={workspace.id}
                                            onClick={() => handleSwitch(workspace.id)}
                                            disabled={!!switching}
                                            className={cn(
                                                "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900",
                                                workspace.id === session?.user?.activeWorkspaceId
                                                    ? "bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/10 dark:text-indigo-400"
                                                    : "text-gray-600 dark:text-gray-400"
                                            )}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white shadow-sm transition-all group-hover:scale-110",
                                                    // Dynamic gradients based on index
                                                    idx % 3 === 0 ? "bg-gradient-to-br from-indigo-500 to-purple-600" :
                                                        idx % 3 === 1 ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                                                            "bg-gradient-to-br from-orange-500 to-rose-600"
                                                )}>
                                                    {workspace.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-bold truncate max-w-[120px]">
                                                        {workspace.name === "Personal" ? t.common.personalSpace : workspace.name}
                                                    </div>
                                                    <div className="flex items-center text-[10px] opacity-60">
                                                        <Users className="mr-1 h-3 w-3" />
                                                        {workspace._count?.users || 1} {t.common.members}
                                                    </div>
                                                </div>
                                            </div>
                                            {switching === workspace.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                workspace.id === session?.user?.activeWorkspaceId && (
                                                    <Check className="h-4 w-4" />
                                                )
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>

                            {activeWorkspace && (
                                <div className="mt-2 border-t border-gray-100 pt-2 space-y-1 dark:border-gray-800">

                                    <button
                                        className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                                        onClick={async () => {
                                            if (activeWorkspace.name === "Personal") {
                                                alert(t.common.leavePersonalSpaceError);
                                                return;
                                            }
                                            if (confirm(t.common.leaveWorkspace + "?")) {
                                                const res = await fetch("/api/v1/workspaces/leave", { method: "POST" });
                                                if (res.ok) {
                                                    await update({ activeWorkspaceId: null });
                                                    window.location.href = "/dashboard";
                                                }
                                            }
                                        }}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                            <Plus className="h-4 w-4 rotate-45" />
                                        </div>
                                        <span>{t.common.leaveWorkspace}</span>
                                    </button>
                                </div>
                            )}

                            <div className="mt-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                                <button
                                    className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                                    onClick={() => {
                                        setIsOpen(false);
                                        window.location.href = "/onboarding";
                                    }}
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-900">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                    <span>{t.common.createWorkspace || "Create Workspace"}</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
