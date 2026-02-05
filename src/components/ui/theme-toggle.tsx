"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-9 w-9" />;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDark ? (
                        <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
                    ) : (
                        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}
