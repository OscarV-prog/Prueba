"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User, LayoutDashboard, Users, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "~/providers/language-provider";

export function UserMenu() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session?.user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white p-1 pr-3 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
            >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white uppercase">
                    {session.user.name?.[0] || session.user.email?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user.name || "User"}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-gray-950"
                    >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>

                        <div className="py-1">
                            <Link
                                href="/onboarding"
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30 rounded-lg mx-1 transition-colors font-semibold shadow-sm"
                            >
                                <Plus className="mr-3 h-4 w-4" />
                                {t.common.addWorkspace}
                            </Link>
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 rounded-lg mx-1 transition-colors"
                            >
                                <LayoutDashboard className="mr-3 h-4 w-4" />
                                {t.common.myDashboard}
                            </Link>
                            <Link
                                href="/team"
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 rounded-lg mx-1 transition-colors"
                            >
                                <Users className="mr-3 h-4 w-4" />
                                {t.common.teamOverview}
                            </Link>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                            <button
                                onClick={() => void signOut({ callbackUrl: "/auth/signin" })}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg mx-1 transition-colors"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                {t.common.logout}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
