"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "~/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function LanguageToggle() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 transition-all hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
                title={t.common.language}
            >
                <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
                        >
                            <button
                                onClick={() => {
                                    setLanguage("en");
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2 text-sm font-medium transition-colors rounded-xl ${language === "en"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => {
                                    setLanguage("es");
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2 text-sm font-medium transition-colors rounded-xl ${language === "es"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                                    }`}
                            >
                                Español
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
