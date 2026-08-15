"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(
        error.message.startsWith("Password should contain")
          ? "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol (min. 8 karakter)."
          : error.message,
      );
      setLoading(false);
      return;
    }

    router.push("/chat");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="mb-1">
        <h1 className="text-xl font-semibold">Create an account</h1>
        <p className="mt-1 text-sm text-muted">Sign up to start chatting.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium text-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <p className="text-xs text-muted">
          Min. 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
          Log in
        </Link>
      </p>
    </form>
  );
}
