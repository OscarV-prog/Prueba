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
        workspaces: string;
        selectWorkspace: string;
        createWorkspace: string;
        leaveWorkspace: string;
        workspaceSettings: string;
        addWorkspace: string;
        personalSpace: string;
        leavePersonalSpaceError: string;
        myDashboard: string;
        teamOverview: string;
        members: string;
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
        noWorkspaceTitle: string;
        noWorkspaceDesc: string;
        noWorkspaceQuote: string;
        addTaskPlaceholder: string;
        skip: string;
    };
    team: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        inviteMember: string;
        memberWorkload: string;
        collaborator: string;
        tasks: string;
        inProgress: string;
        efficiency: string;
        completed: string;
        inviteModalTitle: string;
        inviteModalDesc: string;
        emailLabel: string;
        generateToken: string;
        tokenGenerated: string;
        shareToken: string;
        done: string;
    };
    join: {
        title: string;
        subtitle: string;
        tokenLabel: string;
        tokenPlaceholder: string;
        button: string;
        error: string;
    };
    priority: {
        high: string;
        medium: string;
        low: string;
        label: string;
    };
    task: {
        created: string;
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
            workspaces: "Workspaces",
            selectWorkspace: "Select workspace",
            createWorkspace: "Create workspace",
            leaveWorkspace: "Leave workspace",
            workspaceSettings: "Workspace settings",
            addWorkspace: "Add Workspace",
            personalSpace: "My Space",
            leavePersonalSpaceError: "You cannot leave your personal space.",
            myDashboard: "My Dashboard",
            teamOverview: "Team Overview",
            members: "members",
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
            noWorkspaceTitle: "Your Journey Starts Here",
            noWorkspaceDesc: "Create your first workspace to begin organizing your team and tasks with precision.",
            noWorkspaceQuote: "Takes less than 30 seconds.",
            addTaskPlaceholder: "Add a task for Today...",
            skip: "Skip",
        },
        team: {
            title: "Team Overview",
            subtitle: "Monitor workspace health and member workload.",
            searchPlaceholder: "Search tasks...",
            inviteMember: "Invite Member",
            memberWorkload: "Member Workload",
            collaborator: "Collaborator",
            tasks: "tasks",
            inProgress: "In Progress",
            efficiency: "Efficiency",
            completed: "Completed",
            inviteModalTitle: "Invite to Team",
            inviteModalDesc: "Send an invitation to a new team member.",
            emailLabel: "Email Address",
            generateToken: "Generate Invitation Token",
            tokenGenerated: "Invitation generated successfully!",
            shareToken: "Share this token:",
            done: "Done",
        },
        join: {
            title: "Join a Team",
            subtitle: "Enter your invitation token to gain access to your team's workspace.",
            tokenLabel: "Invitation Token",
            tokenPlaceholder: "Paste your token here...",
            button: "Join Workspace",
            error: "Invalid or expired token",
        },
        priority: {
            high: "High",
            medium: "Medium",
            low: "Low",
            label: "Priority",
        },
        task: {
            created: "Created",
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
            workspaces: "Espacios de trabajo",
            selectWorkspace: "Seleccionar espacio",
            createWorkspace: "Crear espacio",
            leaveWorkspace: "Salir del espacio",
            workspaceSettings: "Configuración del espacio",
            addWorkspace: "Agregar Espacio",
            personalSpace: "Mi Espacio",
            leavePersonalSpaceError: "No puedes salir de tu espacio personal.",
            myDashboard: "Mi Panel",
            teamOverview: "Vista de Equipo",
            members: "miembros",
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
            noWorkspaceTitle: "Tu viaje comienza aquí",
            noWorkspaceDesc: "Crea tu primer espacio de trabajo para empezar a organizar tu equipo y tareas con precisión.",
            noWorkspaceQuote: "Toma menos de 30 segundos.",
            addTaskPlaceholder: "Agrega una tarea para hoy...",
            skip: "Omitir",
        },
        team: {
            title: "Vista de Equipo",
            subtitle: "Monitorea la salud del espacio y carga de trabajo.",
            searchPlaceholder: "Buscar tareas...",
            inviteMember: "Invitar Miembro",
            memberWorkload: "Carga de Trabajo",
            collaborator: "Colaborador",
            tasks: "tareas",
            inProgress: "En Progreso",
            efficiency: "Eficiencia",
            completed: "Completadas",
            inviteModalTitle: "Invitar al Equipo",
            inviteModalDesc: "Envía una invitación a un nuevo miembro.",
            emailLabel: "Correo Electrónico",
            generateToken: "Generar Token",
            tokenGenerated: "¡Invitación generada con éxito!",
            shareToken: "Comparte este token:",
            done: "Listo",
        },
        join: {
            title: "Unirse al Equipo",
            subtitle: "Ingresa tu token de invitación para acceder al espacio de trabajo.",
            tokenLabel: "Token de Invitación",
            tokenPlaceholder: "Pega tu token aquí...",
            button: "Unirse al Espacio",
            error: "Token inválido o expirado",
        },
        priority: {
            high: "Alta",
            medium: "Media",
            low: "Baja",
            label: "Prioridad",
        },
        task: {
            created: "Creado",
        }
    },
};

export type Language = "en" | "es";
