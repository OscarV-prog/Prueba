"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Language, type Dictionary } from "~/lib/i18n/dictionaries";

interface LanguageContextType {
    language: Language;
    t: Dictionary;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        const saved = document.cookie
            .split("; ")
            .find((row) => row.startsWith("language="))
            ?.split("=")[1] as Language;

        if (saved && (saved === "en" || saved === "es")) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        document.cookie = `language=${lang}; path=/; max-age=31536000`; // 1 year
    };

    const value = {
        language,
        t: dictionaries[language],
        setLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
