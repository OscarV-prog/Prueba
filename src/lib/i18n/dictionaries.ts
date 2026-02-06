export interface Dictionary {
    common: {
        dashboard: string;
        team: string;
        joinTeam: string;
        logout: string;
        login: string;
        signup: string;
        theme: string;
        language: string;
    };
    onboarding: {
        title: string;
        description: string;
        label: string;
        placeholder: string;
        button: string;
        premium: string;
        error: string;
    };
    dashboard: {
        title: string;
        welcome: string;
        myDay: string;
        overdue: string;
        today: string;
        allCaughtUp: string;
        enjoyDay: string;
    };
}

export const dictionaries: Record<Language, Dictionary> = {
    en: {
        common: {
            dashboard: "Dashboard",
            team: "Team",
            joinTeam: "Join Team",
            logout: "Log out",
            login: "Log in",
            signup: "Sign up",
            theme: "Theme",
            language: "Language",
        },
        onboarding: {
            title: "Create Your Workspace",
            description: "Prueba organizes your tasks into workspaces. Give yours a name to begin.",
            label: "Workspace Name",
            placeholder: "e.g. Acme Marketing, Personal Projects...",
            button: "Launch my workspace",
            premium: "Premium Setup",
            error: "Something went wrong",
        },
        dashboard: {
            title: "My Workspace",
            welcome: "Welcome back",
            myDay: "My Day",
            overdue: "Overdue",
            today: "Today",
            allCaughtUp: "You're all caught up!",
            enjoyDay: "Enjoy your productive day.",
        }
    },
    es: {
        common: {
            dashboard: "Panel",
            team: "Equipo",
            joinTeam: "Unirse",
            logout: "Cerrar sesión",
            login: "Iniciar sesión",
            signup: "Registrarse",
            theme: "Tema",
            language: "Idioma",
        },
        onboarding: {
            title: "Crea tu espacio de trabajo",
            description: "Prueba organiza tus tareas en espacios. Dale un nombre para empezar.",
            label: "Nombre del espacio",
            placeholder: "ej. Marketing Acme, Proyectos Personales...",
            button: "Lanzar mi espacio",
            premium: "Configuración Premium",
            error: "Algo salió mal",
        },
        dashboard: {
            title: "Mi Espacio",
            welcome: "Bienvenido de nuevo",
            myDay: "Mi Día",
            overdue: "Vencidas",
            today: "Hoy",
            allCaughtUp: "¡Estás al día!",
            enjoyDay: "Disfruta de tu día productivo.",
        }
    },
};

export type Language = "en" | "es";
