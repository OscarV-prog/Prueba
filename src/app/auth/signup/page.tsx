"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema } from "~/modules/auth/auth.dto";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
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
            signupSchema.parse(formData);

            const res = await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/auth/signin?message=Account created successfully");
            } else {
                const data = await res.json();
                setError(data.message || "Signup failed");
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
            {/* Left side: Visual */}
            <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-purple-600">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-700 via-indigo-700 to-indigo-600" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center w-full px-20">
                        <h2 className="text-5xl font-black tracking-tight leading-tight italic">Unleash <span className="text-purple-300">Team</span> Potential.</h2>
                        <p className="mt-6 text-purple-100 text-lg">Join thousands of teams scaling their operations with Prueba.</p>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-gray-950">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mx-auto w-full max-w-sm lg:w-96"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Get Started
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Create your free account and start organizing.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/30">
                                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white"
                                            placeholder="Jane Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white"
                                            placeholder="jane@example.com"
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
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white"
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
                                className="group relative flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/auth/signin" className="font-bold text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
