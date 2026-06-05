import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Create account — Catalog",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-neutral-100 px-4 py-8 pb-24 lg:pb-12">
      <div className="mx-auto mb-4 max-w-7xl text-sm text-neutral-400">Sign up</div>
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
