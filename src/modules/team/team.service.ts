import { db } from "~/server/db";

export class TeamService {
    async getTeamOverview(workspaceId: string, filters?: {
        assigneeId?: string;
        status?: string;
        priority?: string;
        search?: string;
    }) {
        return await db.task.findMany({
            where: {
                workspaceId,
                ...(filters?.assigneeId && { assigneeId: filters.assigneeId }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.priority && { priority: filters.priority }),
                ...(filters?.search && {
                    OR: [
                        { title: { contains: filters.search, mode: "insensitive" } },
                        { description: { contains: filters.search, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                assignee: {
                    select: { id: true, name: true, image: true }
                },
                tags: {
                    include: { tag: true }
                }
            },
            orderBy: [
                { dueDate: "asc" },
                { priority: "desc" }
            ]
        });
    }

    async getWorkloadStats(workspaceId: string) {
        const tasks = await db.task.findMany({
            where: { workspaceId },
            select: {
                status: true,
                assigneeId: true,
            }
        });

        // Grouping logic
        const stats: Record<string, { total: number; done: number; inProgress: number; todo: number }> = {};

        tasks.forEach(t => {
            const aid = t.assigneeId || "unassigned";
            if (!stats[aid]) stats[aid] = { total: 0, done: 0, inProgress: 0, todo: 0 };
            stats[aid].total++;
            if (t.status === "DONE") stats[aid].done++;
            else if (t.status === "IN_PROGRESS") stats[aid].inProgress++;
            else stats[aid].todo++;
        });

        return stats;
    }
}

export const teamService = new TeamService();
