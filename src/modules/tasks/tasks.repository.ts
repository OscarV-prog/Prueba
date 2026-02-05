import { db } from "~/server/db";
import type { CreateTaskDto, UpdateTaskDto } from "./tasks.dto";

export class TasksRepository {
    async create(data: CreateTaskDto & { workspaceId: string; createdById: string }) {
        return await db.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: data.status,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                workspaceId: data.workspaceId,
                assigneeId: data.assigneeId,
                createdById: data.createdById,
                displayOrder: data.displayOrder || "0",
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findById(id: string, workspaceId: string) {
        return await db.task.findUnique({
            where: { id, workspaceId },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findMany(workspaceId: string, filters?: { status?: string; assigneeId?: string }) {
        return await db.task.findMany({
            where: {
                workspaceId,
                ...(filters?.status && { status: filters.status }),
                ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        });
    }

    async update(id: string, workspaceId: string, data: UpdateTaskDto) {
        return await db.task.update({
            where: { id, workspaceId },
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async delete(id: string, workspaceId: string) {
        return await db.task.delete({
            where: { id, workspaceId },
        });
    }
}

export const tasksRepository = new TasksRepository();
