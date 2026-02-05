import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    displayOrder: z.string().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export const taskResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    priority: z.string(),
    status: z.string(),
    dueDate: z.string().nullable(), // Changed to string for easier JSON handling
    workspaceId: z.string(),
    assigneeId: z.string().nullable(),
    displayOrder: z.string(),
    createdById: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    assignee: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
    }).optional().nullable(),
});

export type TaskResponseDto = z.infer<typeof taskResponseSchema>;
