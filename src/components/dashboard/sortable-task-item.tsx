"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem } from "./task-item";
import { type TaskResponseDto } from "~/modules/tasks/tasks.dto";

export function SortableTaskItem({ task }: { task: TaskResponseDto }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: "relative" as const,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <TaskItem task={task} dragHandleProps={{ ...attributes, ...listeners }} />
        </div>
    );
}
