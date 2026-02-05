"use client";

import { useEffect, useState } from "react";
import { ActivityStream } from "~/components/team/activity-stream";
import { Search, Users, LayoutGrid, BarChart3, Loader2, UserPlus, Link as LinkIcon, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

export default function TeamPage() {
    const [data, setData] = useState<{ tasks: any[]; stats: any }>({ tasks: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [invitationToken, setInvitationToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/v1/team/overview?search=${search}`);
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            const res = await fetch("/api/v1/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail }),
            });
            if (res.ok) {
                const data = await res.json();
                setInvitationToken(data.token);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsInviting(false);
        }
    };

    const copyToClipboard = () => {
        if (!invitationToken) return;
        navigator.clipboard.writeText(invitationToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 sm:p-10">
            <div className="mx-auto max-w-7xl space-y-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Team Overview</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Monitor workspace health and member workload.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full rounded-xl border-gray-200 bg-white/50 py-2.5 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950/50 dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-95"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span className="hidden sm:inline">Invite Member</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Workload Visualization */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>Member Workload</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(data.stats).map(([userId, stats]: [string, any]) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={userId}
                                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white uppercase">
                                                {userId.slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                                                    Member_{userId.slice(0, 4)}
                                                </p>
                                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Collaborator</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                                            {stats.total} tasks
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-gray-500 dark:text-gray-400">In Progress</span>
                                            <span className="text-gray-900 dark:text-white">{stats.inProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                                                className="bg-indigo-500 h-full transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400 font-bold">
                                                <BarChart3 className="h-3 w-3" />
                                                <span>Efficiency: {Math.round((stats.done / (stats.total || 1)) * 100)}%</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                                                {stats.done} Completed
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Stream */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/30 backdrop-blur-sm h-full">
                            <ActivityStream />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowInviteModal(false);
                                setInvitationToken(null);
                                setInviteEmail("");
                            }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invite to Team</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Send an invitation to a new team member.</p>

                            {!invitationToken ? (
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@example.com"
                                            className="w-full rounded-xl border-gray-200 bg-gray-50 py-3 px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isInviting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Generate Invitation Token"}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-4 border border-green-100 dark:border-green-900/30">
                                        <p className="text-xs font-semibold text-green-700 dark:text-green-400">Invitation generated successfully!</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Share this token:</label>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 truncate rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-mono dark:border-gray-800 dark:bg-gray-950 dark:text-white">
                                                {invitationToken}
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                            >
                                                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowInviteModal(false);
                                            setInvitationToken(null);
                                            setInviteEmail("");
                                        }}
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
