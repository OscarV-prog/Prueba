"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link as LinkIcon, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function JoinPage() {
    const { update } = useSession();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/v1/invitations/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid or expired token");
            }

            // Update session with new activeWorkspaceId
            await update({ activeWorkspaceId: data.id });

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900 pb-12">
                    <div className="flex justify-center mb-8">
                        <div className="rounded-2xl bg-green-50 dark:bg-green-950/30 p-4 ring-8 ring-green-50/50 dark:ring-green-900/10">
                            <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                            Join a Team
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your invitation token to gain access to your team's workspace.
                        </p>
                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleJoin}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/30"
                            >
                                <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                                    Invitation Token
                                </label>
                                <div className="relative group">
                                    <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 py-4 pl-12 pr-6 text-sm shadow-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        placeholder="Paste your token here..."
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token.trim()}
                            className="group relative flex w-full items-center justify-center rounded-xl bg-gray-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-100 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Join Workspace
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
