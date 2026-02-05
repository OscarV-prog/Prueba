import { db } from "~/server/db";

export type ActivityAction =
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_COMPLETED"
    | "TASK_DELETED"
    | "USER_INVITED"
    | "USER_JOINED"
    | "USER_REMOVED";

export class ActivityLogService {
    async log(params: {
        workspaceId: string;
        userId: string;
        actionType: ActivityAction;
        entityType: "TASK" | "USER" | "WORKSPACE";
        entityId: string;
        metadata?: any;
    }) {
        // Non-blocking log (we don't await this in the main flow if we want extreme speed, 
        // but Prisma's create is fast enough for now. In a massive app, we'd queue this.)
        try {
            await db.activityLog.create({
                data: {
                    workspaceId: params.workspaceId,
                    userId: params.userId,
                    actionType: params.actionType,
                    entityType: params.entityType,
                    entityId: params.entityId,
                    metadata: params.metadata || {},
                },
            });
        } catch (error) {
            console.error("Failed to log activity:", error);
        }
    }

    async getLogs(workspaceId: string, limit = 50, offset = 0) {
        return await db.activityLog.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        });
    }
}

export const activityLogService = new ActivityLogService();
