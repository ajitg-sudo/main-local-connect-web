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

export default function CustomerSignupPage() {
  const { registerCustomer } = useAuth();
  const { error: toastError, success } = useToast();
  const router = useRouter();
  const returnTo = getRedirectPath() || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toastError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toastError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerCustomer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        password: form.password
      });
      success("Account created! You're signed in.");
      clearRedirectPath();
      router.replace(returnTo);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container flex min-h-[70vh] flex-col justify-center py-10 sm:py-12">
      <div className="card mx-auto w-full max-w-lg">
        <p className="eyebrow">Play &amp; win</p>
        <h1 className="heading-page mt-2">Create a free account</h1>
        <p className="text-body mt-2 text-muted">
          Sign up to play games on business listings and receive discount coupon codes by email — for you and the shop owner.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label>
            <span className="text-label mb-1 block">Full name</span>
            <input className="input-field" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </label>
          <label>
            <span className="text-label mb-1 block">Email</span>
            <input className="input-field" type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}  />
          </label>
          <label>
            <span className="text-label mb-1 block">Phone</span>
            <input className="input-field" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </label>
          <label>
            <span className="text-label mb-1 block">City</span>
            <input className="input-field" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
          </label>
          <PasswordInput
            label="Password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <PasswordInput
            label="Confirm password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          />

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account & continue"}
          </button>
        </form>

        <p className="text-body mt-4 text-center text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-teal">
            Sign in
          </Link>
        </p>
        <p className="text-caption mt-3 text-center text-muted">
          Business owner?{" "}
          <Link href="/register" className="font-bold text-teal">
            Register your business
          </Link>
        </p>
      </div>
      <PageInterlinks links={AUTH_INTERLINKS.filter((l) => l.href !== "/signup")} className="mx-auto mt-6 max-w-lg" />
    </section>
  );
}
