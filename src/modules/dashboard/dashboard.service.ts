import { db } from "~/server/db";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export class DashboardService {
    async getMyDayTasks(userId: string, workspaceId: string, timezone: string = "UTC") {
        // Calculate "Today" in the user's local timezone
        const now = new Date();
        const zonedDate = toZonedTime(now, timezone);
        const todayEnd = endOfDay(zonedDate);

        const tasks = await db.task.findMany({
            where: {
                workspaceId,
                assigneeId: userId,
                status: { not: "DONE" },
                OR: [
                    { dueDate: { lte: todayEnd } },
                    { dueDate: null } // We include tasks with no due date in "My Day" by default if they are assigned
                ],
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
            orderBy: [
                { dueDate: "asc" },
                { priority: "desc" },
            ],
        });

        const stats = {
            total: tasks.length,
            overdue: tasks.filter(t => t.dueDate && t.dueDate < startOfDay(zonedDate)).length,
            today: tasks.filter(t => t.dueDate && t.dueDate >= startOfDay(zonedDate) && t.dueDate <= todayEnd).length,
            noDueDate: tasks.filter(t => !t.dueDate).length,
        };

        return {
            tasks,
            stats,
        };
    }
}

export const dashboardService = new DashboardService();
