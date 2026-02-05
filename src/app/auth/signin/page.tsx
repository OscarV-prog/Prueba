"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "~/modules/auth/auth.dto";
import { Mail, Lock, Loader2, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

function SigninForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            loginSchema.parse(formData);
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err: any) {
            if (err.name === "ZodError") {
                setError(err.errors[0].message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] overflow-hidden">
            {/* Left side: Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mx-auto w-full max-w-sm lg:w-96"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Log in to manage your team and tasks efficiently.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/30"
                                >
                                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            className="block w-full rounded-xl border-gray-200 bg-white/50 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950/50 dark:text-white"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="block w-full rounded-xl border-gray-200 bg-white/50 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950/50 dark:text-white"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                                </div>
                                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                                    <span className="bg-gray-50 dark:bg-gray-950 px-4 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900">
                                    <Github className="mr-3 h-5 w-5" />
                                    Github
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            New here?{" "}
                            <Link href="/auth/signup" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Visual */}
            <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-indigo-600">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center w-full px-20">
                        <h2 className="text-5xl font-black tracking-tight leading-tight">Master your workflow with <span className="text-indigo-300">Precision.</span></h2>
                        <p className="mt-6 text-indigo-100 text-lg">The productivity platform designed for teams that move fast.</p>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function SigninPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <SigninForm />
        </Suspense>
    );
}
