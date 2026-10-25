"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto mt-16 max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Sign in to orders</h1>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className="h-12 w-full rounded-xl border-2 border-mist bg-white px-3.5 outline-none focus:border-ink"
        />
        {error && (
          <p id="login-error" role="alert" className="mt-1.5 text-sm text-aero-deep">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-ink font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
