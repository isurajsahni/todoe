"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      localStorage.setItem("token", data.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <h1 className="text-2xl font-bold">Login</h1>
        <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-transparent p-3" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border border-border bg-transparent p-3" required />
        <button disabled={loading} className="w-full rounded-xl bg-primary p-3 font-semibold text-black">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-muted">
          No account? <Link href="/signup" className="text-primary">Create one</Link>
        </p>
      </form>
    </div>
  );
}
