"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconLogo } from "./icons";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10 flex items-center justify-between text-xs">
        <Link href="/" className="flex items-center gap-1.5 font-semibold text-neutral-900">
          <IconLogo className="h-4 w-4 text-neutral-900" />
          ShopCo
        </Link>
        <Link href={mode === "login" ? "/register" : "/login"} className="text-neutral-500 hover:text-neutral-800">
          {mode === "login" ? "Create account" : "Sign in"}
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-xs text-neutral-500">
          {mode === "login"
            ? "Sign in to your account"
            : "Join ShopCo and start shopping"}
        </p>
      </div>

      {mode === "register" && (
        <label className="block">
          <span className="text-xs font-medium text-neutral-700">Full name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="John Doe"
            className="mt-1.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </label>
      )}

      <label className="block">
        <span className="text-xs font-medium text-neutral-700">
          {mode === "login" ? "Email or username" : "Email"}
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-neutral-700">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
          className="mt-1.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
      </label>

      {mode === "register" && (
        <label className="block">
          <span className="text-xs font-medium text-neutral-700">
            Confirm password
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </label>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        {loading
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      <div className="relative py-1">
        <div className="h-px bg-neutral-200" />
        <span className="absolute inset-0 mx-auto w-fit bg-white px-2 text-[11px] text-neutral-400">or</span>
      </div>

      <button
        type="button"
        className="w-full rounded-md border border-neutral-200 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Continue with Google
      </button>

      <p className="text-center text-xs text-neutral-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>

      {mode === "login" && (
        <p className="rounded-md bg-neutral-100 p-2.5 text-center text-[11px] text-neutral-600">
          Demo: demo@shop.dev / password123
        </p>
      )}
      </form>
    </div>
  );
}
