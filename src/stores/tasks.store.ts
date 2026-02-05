import { create } from "zustand";
import { type TaskResponseDto } from "~/modules/tasks/tasks.dto";

interface TasksState {
    tasks: TaskResponseDto[];
    loading: boolean;
    error: string | null;

    // Actions
    setTasks: (tasks: TaskResponseDto[]) => void;
    addTask: (task: TaskResponseDto) => void;
    updateTask: (taskId: string, updates: Partial<TaskResponseDto>) => void;
    removeTask: (taskId: string) => void;
    reorderTask: (taskId: string, displayOrder: string) => void;

    // Sync
    fetchMyDayTasks: (timezone?: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
    tasks: [],
    loading: false,
    error: null,

    setTasks: (tasks) => set({ tasks }),

    addTask: (task) =>
        set((state) => ({
            tasks: [task, ...state.tasks].sort((a, b) =>
                (a.displayOrder || "0").localeCompare(b.displayOrder || "0")
            ),
        })),

    updateTask: (taskId, updates) =>
        set((state) => {
            const newTasks = state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
            return {
                tasks: newTasks.sort((a, b) =>
                    (a.displayOrder || "0").localeCompare(b.displayOrder || "0")
                ),
            };
        }),

    removeTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

    reorderTask: (taskId, displayOrder) =>
        set((state) => ({
            tasks: state.tasks
                .map((t) => (t.id === taskId ? { ...t, displayOrder } : t))
                .sort((a, b) => (a.displayOrder || "0").localeCompare(b.displayOrder || "0")),
        })),

    fetchMyDayTasks: async (timezone = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/v1/dashboard/my-day?timezone=${timezone}`);
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            const tasks = (data.tasks as TaskResponseDto[]).sort((a, b) =>
                (a.displayOrder || "0").localeCompare(b.displayOrder || "0")
            );
            set({ tasks, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },
}));
