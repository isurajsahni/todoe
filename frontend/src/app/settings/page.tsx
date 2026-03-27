"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  useAuthGuard();
  const [loginTime, setLoginTime] = useState("09:00");
  const [logoutTime, setLogoutTime] = useState("18:00");

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setLoginTime(res.data.loginTime || "09:00");
      setLogoutTime(res.data.logoutTime || "18:00");
    }).catch(() => null);
  }, []);

  const save = async () => {
    await api.put("/users/schedule", { loginTime, logoutTime });
    toast.success("Work schedule updated");
  };

  const checkPending = async () => {
    const { data } = await api.get("/notifications/pending-before-logout");
    if (!data.shouldNotify) return toast.success("No pending task warning right now");
    toast.warning(`Pending today: ${data.tasks.map((x: { title: string }) => x.title).join(", ")}`);
  };

  const enablePush = async () => {
    try {
      if (!("serviceWorker" in navigator)) return toast.error("Service worker not supported");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return toast.error("Notification permission denied");
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      await api.post("/notifications/subscribe", { subscription: sub });
      toast.success("Browser push enabled");
    } catch {
      toast.error("Could not enable push");
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-2xl font-bold">Work Schedule & Notifications</h2>
        <label className="block text-sm">Login Time<input type="time" value={loginTime} onChange={(e) => setLoginTime(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background p-2" /></label>
        <label className="block text-sm">Logout Time<input type="time" value={logoutTime} onChange={(e) => setLogoutTime(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background p-2" /></label>
        <div className="flex gap-2">
          <button onClick={save} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black">Save</button>
          <button onClick={checkPending} className="rounded-xl border border-border px-4 py-2 text-sm">Check Smart Reminder</button>
          <button onClick={enablePush} className="rounded-xl border border-border px-4 py-2 text-sm">Enable Push</button>
        </div>
      </div>
    </DashboardShell>
  );
}
