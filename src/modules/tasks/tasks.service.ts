import { tasksRepository } from "./tasks.repository";
import type { CreateTaskDto, UpdateTaskDto } from "./tasks.dto";

export class TasksService {
    async createTask(userId: string, workspaceId: string, dto: CreateTaskDto) {
        // Automatically assign to the creator if no assignee is specified
        const data = {
            ...dto,
            assigneeId: dto.assigneeId ?? userId,
            workspaceId,
            createdById: userId,
        };

        return await tasksRepository.create(data);
    }

    async getTasks(workspaceId: string, filters?: { status?: string; assigneeId?: string }) {
        return await tasksRepository.findMany(workspaceId, filters);
    }

    async getTaskById(taskId: string, workspaceId: string) {
        const task = await tasksRepository.findById(taskId, workspaceId);
        if (!task) {
            throw new Error("Task not found");
        }
        return task;
    }

    async updateTask(taskId: string, workspaceId: string, dto: UpdateTaskDto) {
        // Verify task exists in workspace
        await this.getTaskById(taskId, workspaceId);

        return await tasksRepository.update(taskId, workspaceId, dto);
    }

    async deleteTask(taskId: string, workspaceId: string) {
        // Verify task exists in workspace
        await this.getTaskById(taskId, workspaceId);

        return await tasksRepository.delete(taskId, workspaceId);
    }

    async completeTask(taskId: string, workspaceId: string) {
        return await this.updateTask(taskId, workspaceId, { status: "DONE" });
    }

    async reassignTask(taskId: string, workspaceId: string, assigneeId: string | null) {
        // In a real app we'd verify assigneeId belongs to the workspace here
        return await this.updateTask(taskId, workspaceId, { assigneeId });
    }

    async reorderTask(taskId: string, workspaceId: string, displayOrder: string) {
        return await this.updateTask(taskId, workspaceId, { displayOrder });
    }
}

export const tasksService = new TasksService();
