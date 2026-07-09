"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import { AdminShellProvider } from "../context/adminShellContext";
import { BreadcrumbBar, BreadcrumbProvider } from "../context/breadcrumbContext";
import { api } from "../services/api";

function AdminMain({ children, pendingJoins, pendingKyc, pendingPayments }) {
  return (
    <>
      <Suspense fallback={<div className="admin-header site-header site-header-entered" />}>
        <AdminHeader pendingJoins={pendingJoins} pendingKyc={pendingKyc} pendingPayments={pendingPayments} />
      </Suspense>
      <main className="admin-main-offset flex-1 pb-5 sm:pb-6">
        <BreadcrumbBar />
        <div className="page-container">{children}</div>
      </main>
    </>
  );
}

export default function AdminLayout({ children }) {
  const [pendingJoins, setPendingJoins] = useState(0);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  const refreshAdminStats = useCallback(async () => {
    try {
      const data = await api.adminDashboard();
      const count = data.communityMembers?.filter((m) => m.status === "Pending").length || 0;
      setPendingJoins(count);
      setPendingKyc(data.kycStats?.queue || 0);
      setPendingPayments(data.paymentStats?.pending || 0);
    } catch {
      setPendingJoins(0);
      setPendingKyc(0);
      setPendingPayments(0);
    }
  }, []);

  useEffect(() => {
    refreshAdminStats();
  }, [refreshAdminStats]);

  return (
    <AdminShellProvider value={{ refreshAdminStats }}>
      <div className="admin-shell flex min-h-screen flex-col bg-bg">
        <Suspense fallback={
          <AdminMain pendingJoins={pendingJoins} pendingKyc={pendingKyc} pendingPayments={pendingPayments}>
            {children}
          </AdminMain>
        }>
          <BreadcrumbProvider>
            <AdminMain pendingJoins={pendingJoins} pendingKyc={pendingKyc} pendingPayments={pendingPayments}>
              {children}
            </AdminMain>
          </BreadcrumbProvider>
        </Suspense>
      </div>
    </AdminShellProvider>
  );
}
