"use client";

import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { UserMenu } from "./auth/user-menu";
import { useSession } from "next-auth/react";
import { useLanguage } from "~/providers/language-provider";
import { LanguageToggle } from "./ui/language-toggle";
import { WorkspaceSwitcher } from "./ui/workspace-switcher";

export function Navbar() {
    const { data: session } = useSession();
    const { t } = useLanguage();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Prueba
                        </span>
                    </Link>


                    {session && (
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t.common.dashboard}
                            </Link>
                            <Link
                                href="/team"
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t.common.team}
                            </Link>
                            <Link
                                href="/join"
                                className="text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t.common.joinTeam}
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {session && <WorkspaceSwitcher />}
                    <LanguageToggle />
                    <ThemeToggle />
                    {session ? (
                        <UserMenu />
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/auth/signin"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                {t.common.login}
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
                            >
                                {t.common.signup}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
