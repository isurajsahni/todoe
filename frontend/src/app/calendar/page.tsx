"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { api } from "@/lib/api";
import { Task } from "@/types/task";

export default function CalendarPage() {
  useAuthGuard();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data)).catch(() => null);
  }, []);

  const tasksForDate = useMemo(() => {
    if (!date) return [];
    const key = date.toDateString();
    return tasks.filter((t) => new Date(t.dueDate).toDateString() === key);
  }, [date, tasks]);

  return (
    <DashboardShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <DayPicker mode="single" selected={date} onSelect={setDate} />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-lg font-bold">Tasks for selected date</h2>
          <div className="space-y-2">
            {tasksForDate.map((task) => (
              <div key={task._id} className="rounded-xl border border-border bg-background p-3">
                <p className="font-semibold">{task.title}</p>
                <p className="text-xs text-muted">{task.status} · {task.priority}</p>
              </div>
            ))}
            {tasksForDate.length === 0 && <p className="text-sm text-muted">No tasks scheduled.</p>}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
