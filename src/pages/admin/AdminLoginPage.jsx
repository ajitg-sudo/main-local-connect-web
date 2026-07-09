"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { clearRedirectPath, getRedirectPath } from "../../utils/navigation";
import PasswordInput from "../../components/common/PasswordInput";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import PageInterlinks from "../../components/layout/PageInterlinks";

export default function AdminLoginPage() {
  const { user, loading, login, logout, isAdmin } = useAuth();
  const { error: toastError, success } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      const redirect = getRedirectPath() || "/admin";
      clearRedirectPath();
      router.replace(redirect);
    }
  }, [loading, user, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedIn = await login({ email: form.email, password: form.password });
      if (loggedIn.role !== "super_admin" && loggedIn.role !== "city_admin") {
        logout();
        toastError("This account does not have admin access.");
        return;
      }
      const redirect = getRedirectPath() || "/admin";
      clearRedirectPath();
      success(`Welcome, ${loggedIn.name || "admin"}!`);
      router.replace(redirect);
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="site-header">
        <div className="page-container site-header-bar">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-body grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-teal to-sky-500 font-semibold text-white sm:h-10 sm:w-10">
              IL
            </span>
            <span>
              <strong className="text-body block leading-tight">Admin Console</strong>
              <small className="text-caption text-muted">India Local Connect</small>
            </span>
          </Link>
          <Link href="/" className="btn-ghost btn-inline px-3">
            Public site
          </Link>
        </div>
      </header>

      <main className="site-header-offset page-container flex flex-1 flex-col justify-center py-10 sm:py-12">
        <div className="breadcrumb-bar mb-6 w-full">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin Login" }]} />
        </div>
        <div className="card mx-auto w-full max-w-md">
          <p className="eyebrow">Staff access only</p>
          <h1 className="heading-page mt-2">Admin login</h1>
          <p className="text-body mt-2 text-muted">
            Sign in with your admin email to manage listings, ads, and platform data.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label>
              <span className="text-label mb-1 block">Admin email</span>
              <input
                className="input-field"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@indialocalconnect.local"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </label>
            <PasswordInput
              label="Password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in to admin"}
            </button>
          </form>

          <p className="text-body mt-6 text-center text-muted">
            Business owner?{" "}
            <Link href="/login" className="font-bold text-teal">
              Owner login
            </Link>
          </p>
        </div>
        <PageInterlinks
          links={[
            { href: "/", label: "Public site" },
            { href: "/login", label: "Owner login" },
            { href: "/contact", label: "Contact support" }
          ]}
          className="mx-auto mt-6 max-w-md"
        />
      </main>
    </div>
  );
}
