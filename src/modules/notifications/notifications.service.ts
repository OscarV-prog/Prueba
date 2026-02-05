import { db } from "~/server/db";
import { appEvents, EVENTS } from "../events/app-events";

export class NotificationService {
    async sendNotification(params: {
        userId: string;
        title: string;
        message: string;
        type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
        link?: string;
    }) {
        // 1. Persist in-app notification
        const notification = await db.notification.create({
            data: {
                userId: params.userId,
                title: params.title,
                message: params.message,
                type: params.type,
                link: params.link,
            }
        });

        // 2. Check user preferences for out-of-band notifications
        const settings = await db.notificationSettings.findUnique({
            where: { userId: params.userId }
        });

        if (settings?.emailEnabled) {
            void this.dispatchEmail(params);
        }

        if (settings?.slackEnabled) {
            void this.dispatchSlack(params);
        }

        return notification;
    }

    private async dispatchEmail(params: any) {
        // TODO: Integrate with Resend/SendGrid
        console.log(`[EMAIL] To: ${params.userId} | ${params.title}: ${params.message}`);
    }

    private async dispatchSlack(params: any) {
        // TODO: Integrate with Slack Webhook
        console.log(`[SLACK] Event: ${params.title}`);
    }

    // Event handlers
    static init() {
        const service = new NotificationService();

        appEvents.on(EVENTS.TASK_CREATED, async (payload) => {
            // Notify assignee if not the creator
            if (payload.assigneeId && payload.assigneeId !== payload.userId) {
                await service.sendNotification({
                    userId: payload.assigneeId,
                    title: "New Task Assigned",
                    message: `You've been assigned: ${payload.title}`,
                    type: "INFO",
                    link: `/dashboard`
                });
            }
        });

        appEvents.on(EVENTS.TASK_COMPLETED, async (payload) => {
            // Logic for notifying team lead or creator could go here
        });
    }
}

// Global initialization
NotificationService.init();
export const notificationService = new NotificationService();
