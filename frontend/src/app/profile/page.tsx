"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { api } from "@/lib/api";

type Me = { name: string; email: string; loginTime: string; logoutTime: string };

export default function ProfilePage() {
  useAuthGuard();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    api.get("/users/me").then((res) => setMe(res.data)).catch(() => null);
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-2xl rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-3xl font-bold tracking-tight">{me?.name || "Profile"}</h2>
        <p className="mt-1 text-muted">{me?.email}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Login Time</p>
            <p className="mt-1 text-xl font-semibold">{me?.loginTime || "--:--"}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Logout Time</p>
            <p className="mt-1 text-xl font-semibold">{me?.logoutTime || "--:--"}</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
