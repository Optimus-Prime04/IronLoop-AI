import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none fixed inset-0 grid-surface opacity-60" />
      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-6 text-center">
          <p className="text-sm font-black text-primary">IRONLOOP AI</p>
          <h1 className="mt-2 text-3xl font-black">Disciplined study starts here.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to continue your study operating system.
          </p>
        </div>
        <Suspense fallback={<div className="h-[420px] rounded-lg border border-border bg-secondary/20" />}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
