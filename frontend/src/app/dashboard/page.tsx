"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { api } from "@/lib/api";

export default function DashboardPage() {
  useAuthGuard();
  const [summary, setSummary] = useState({ completed: 0, pending: 0, overdue: 0 });

  useEffect(() => {
    api.get("/users/summary/today").then((res) => setSummary(res.data)).catch(() => null);
  }, []);

  return (
    <DashboardShell>
      <h2 className="mb-6 text-3xl font-bold tracking-tight">Today&apos;s Tasks Summary</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Completed Tasks" value={summary.completed} />
        <Card title="Pending Tasks" value={summary.pending} />
        <Card title="Overdue Tasks" value={summary.overdue} />
      </div>
    </DashboardShell>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
}
