"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      localStorage.setItem("token", data.token);
      toast.success("Account created");
      router.push("/dashboard");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <input name="name" placeholder="Full name" className="w-full rounded-xl border border-border bg-transparent p-3" required />
        <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-transparent p-3" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border border-border bg-transparent p-3" required />
        <button disabled={loading} className="w-full rounded-xl bg-primary p-3 font-semibold text-black">
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <p className="text-sm text-muted">
          Already have account? <Link href="/login" className="text-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}
