"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Briefcase, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

import { useLanguage } from "~/providers/language-provider";

export default function OnboardingPage() {
    const { update } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/v1/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || t.onboarding.error);
            }

            // Force a session update and wait for it
            await update({
                activeWorkspaceId: data.id
            });

            // Hard redirect to ensure the cookie is processed by middleware
            window.location.href = "/dashboard";
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
                        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 p-4 ring-8 ring-indigo-50/50 dark:ring-indigo-900/10">
                            <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                            {t.onboarding.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.onboarding.description}
                        </p>
                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
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
                                    {t.onboarding.label}
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-4 px-6 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                    placeholder={t.onboarding.placeholder}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="group relative flex w-full items-center justify-center rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {t.onboarding.button}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 flex items-center justify-center space-x-6 grayscale opacity-30 dark:invert">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t.onboarding.premium}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
