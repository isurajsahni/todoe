"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Task, TaskStatus } from "@/types/task";

const columns: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "blocked", label: "Blocked" },
];

export function KanbanBoard({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: (next: Task[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const grouped = useMemo(() => {
    return columns.map((c) => ({ ...c, items: tasks.filter((t) => t.status === c.key).sort((a, b) => a.position - b.position) }));
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const from = tasks.find((t) => t._id === active.id);
    const target = tasks.find((t) => t._id === over.id);
    if (!from || !target) return;

    const same = from.status === target.status;
    if (same) {
      const list = tasks.filter((t) => t.status === from.status).sort((a, b) => a.position - b.position);
      const oldIndex = list.findIndex((i) => i._id === from._id);
      const newIndex = list.findIndex((i) => i._id === target._id);
      const moved = arrayMove(list, oldIndex, newIndex).map((i, idx) => ({ ...i, position: idx }));
      setTasks(tasks.map((t) => moved.find((m) => m._id === t._id) || t));
    } else {
      setTasks(tasks.map((t) => (t._id === from._id ? { ...t, status: target.status } : t)));
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-4">
        {grouped.map((col) => (
          <div key={col.key} className="rounded-2xl bg-surface p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted">{col.label}</h3>
              <span className="rounded bg-surface-2 px-2 py-0.5 text-xs">{col.items.length}</span>
            </div>
            <SortableContext items={col.items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {col.items.map((task) => (
                  <SortableTask key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-xl border border-border bg-background p-3 shadow-sm transition hover:-translate-y-0.5"
    >
      <p className="text-sm font-semibold">{task.title}</p>
      <p className="mt-1 text-xs text-muted">{task.priority} priority</p>
    </div>
  );
}
