"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, KanbanSquare, LayoutDashboard, Moon, Settings, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/board", label: "Task Board", icon: KanbanSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-border bg-[#0a0a0c] p-5 md:block">
        <h1 className="text-xl font-bold tracking-tight text-primary">Workspace</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">Product Team</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? "bg-surface-2 text-primary" : "text-muted hover:bg-surface hover:text-foreground"}`}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="md:ml-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <span className="text-sm uppercase tracking-[0.2em] text-muted">TaskFlow</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-lg border border-border p-2 hover:bg-surface">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-black"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
