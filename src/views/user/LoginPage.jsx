"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { clearRedirectPath, getRedirectPath } from "../../utils/navigation";
import PasswordInput from "../../components/common/PasswordInput";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { AUTH_INTERLINKS } from "../../utils/interlinks";

export default function LoginPage() {
  const { login } = useAuth();
  const { error: toastError, success } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ identifier: form.identifier, password: form.password });
      const redirect = getRedirectPath();
      clearRedirectPath();
      if (redirect) router.replace(redirect);
      else if (user.role === "super_admin" || user.role === "city_admin") router.replace("/admin");
      else if (user.role === "business_owner") router.replace("/owner");
      else router.replace("/");
      success(`Welcome back, ${user.name || "there"}!`);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container flex min-h-[70vh] flex-col justify-center py-10 sm:py-12">
      <div className="card mx-auto w-full max-w-lg">
        <p className="eyebrow">Secure login</p>
        <h1 className="heading-page mt-2">Welcome back</h1>
        <p className="text-body mt-2 text-muted">
          Customers and business owners sign in with email or phone number.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label>
            <span className="text-label mb-1 block">Email or phone</span>
            <input
              className="input-field"
              required
              autoComplete="username"
              placeholder="owner@example.com or +91 98220 44118"
              value={form.identifier}
              onChange={(e) => setForm((p) => ({ ...p, identifier: e.target.value }))}
            />
          </label>
          <PasswordInput
            label="Password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <button className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-body mt-4 text-center text-muted">
          New here?{" "}
          <Link href="/signup" className="font-bold text-teal">
            Sign up to play &amp; win
          </Link>
          {" · "}
          <Link href="/register" className="font-bold text-teal">
            List your business
          </Link>
        </p>

        <p className="text-caption mt-4 text-center text-muted">
          Platform staff?{" "}
          <Link href="/admin/login" className="font-bold text-teal">
            Admin login
          </Link>
        </p>
      </div>
      <PageInterlinks links={AUTH_INTERLINKS.filter((l) => l.href !== "/login")} className="mx-auto mt-6 max-w-lg" />
    </section>
  );
}
