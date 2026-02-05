import { EventEmitter } from "events";
import { activityLogService, type ActivityAction } from "../activity/activity.service";

// Simple Event Bus for the application
class AppEvents extends EventEmitter { }

export const appEvents = new AppEvents();

// Types for events
export const EVENTS = {
    TASK_CREATED: "task.created",
    TASK_UPDATED: "task.updated",
    TASK_COMPLETED: "task.completed",
    TASK_DELETED: "task.deleted",
    USER_INVITED: "user.invited",
    USER_JOINED: "user.joined",
};

// Auto-register Activity Logger
appEvents.on(EVENTS.TASK_CREATED, (payload) => {
    void activityLogService.log({
        workspaceId: payload.workspaceId,
        userId: payload.userId,
        actionType: "TASK_CREATED",
        entityType: "TASK",
        entityId: payload.taskId,
        metadata: { title: payload.title }
    });
});

appEvents.on(EVENTS.TASK_COMPLETED, (payload) => {
    void activityLogService.log({
        workspaceId: payload.workspaceId,
        userId: payload.userId,
        actionType: "TASK_COMPLETED",
        entityType: "TASK",
        entityId: payload.taskId,
    });
});

appEvents.on(EVENTS.USER_INVITED, (payload) => {
    void activityLogService.log({
        workspaceId: payload.workspaceId,
        userId: payload.userId,
        actionType: "USER_INVITED",
        entityType: "USER",
        entityId: payload.invitedEmail,
    });
});
