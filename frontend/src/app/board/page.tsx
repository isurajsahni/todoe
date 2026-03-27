"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { KanbanBoard } from "@/components/kanban-board";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { toast } from "sonner";

const defaultTask = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tags: "",
  status: "todo",
};

export default function BoardPage() {
  useAuthGuard();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(defaultTask);
  const [query, setQuery] = useState("");

  const fetchTasks = () => api.get("/tasks").then((res) => setTasks(res.data)).catch(() => null);
  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  const createTask = async () => {
    try {
      await api.post("/tasks", {
        ...form,
        tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
      });
      toast.success("Task created");
      setForm(defaultTask);
      fetchTasks();
    } catch {
      toast.error("Could not create task");
    }
  };

  return (
    <DashboardShell>
      <div className="mb-5 grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-6">
        <input className="rounded-xl border border-border bg-background p-2 text-sm md:col-span-2" placeholder="Task title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <input className="rounded-xl border border-border bg-background p-2 text-sm" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
        <select className="rounded-xl border border-border bg-background p-2 text-sm" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input className="rounded-xl border border-border bg-background p-2 text-sm" placeholder="tags (comma)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
        <button className="rounded-xl bg-primary p-2 text-sm font-semibold text-black" onClick={createTask}>Add Task</button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." className="w-full max-w-sm rounded-xl border border-border bg-surface p-2 text-sm" />
      </div>
      <KanbanBoard tasks={filtered} setTasks={setTasks} />
    </DashboardShell>
  );
}
