import { useMemo, useState } from "react";
import { planBadgeClass } from "../../utils/constants";

const STATUS_FILTERS = ["", "Paid", "Pending"];
const PLAN_FILTERS = ["", "Premium", "Featured"];

function formatRupee(paise) {
  if (!paise && paise !== 0) return "—";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function PaymentStatusBadge({ status }) {
  const cls =
    status === "Paid"
      ? "user-status-active"
      : status === "Pending"
        ? "user-status-pending"
        : "user-status-inactive";
  return <span className={`user-status-badge ${cls}`}>{status || "—"}</span>;
}

function StatCard({ label, value, accent, highlight }) {
  return (
    <div className="admin-user-stat">
      <span className={`admin-user-stat-accent ${accent}`} aria-hidden="true" />
      <p className="text-caption text-muted">{label}</p>
      <p className={`text-stat mt-1 ${highlight || ""}`}>{value}</p>
    </div>
  );
}

function RefBlock({ label, value }) {
  if (!value) return null;
  return (
    <div className="text-caption">
      <span className="text-muted">{label}: </span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}

function PaymentMobileCard({ row }) {
  return (
    <article className="admin-user-mobile-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body font-bold">{row.business}</p>
          <p className="text-caption mt-0.5 font-mono text-muted">{row.id}</p>
        </div>
        <PaymentStatusBadge status={row.paymentStatus} />
      </div>

      <div className="text-small space-y-1">
        <p>
          <span className={`text-caption rounded-full px-2 py-0.5 font-semibold ${planBadgeClass(row.plan)}`}>
            {row.plan}
          </span>
          <span className="ml-2 font-semibold text-teal-dark">{row.amount}</span>
        </p>
        <p className="text-muted">
          {row.owner || "Unknown owner"}
          {(row.ownerEmail || row.ownerPhone) && (
            <span> · {row.ownerEmail || row.ownerPhone}</span>
          )}
        </p>
        <p className="text-muted">
          Paid: {formatDate(row.paidAt)} · Renews: {formatDate(row.renewsOn)}
        </p>
      </div>

      <div className="rounded-lg border border-line/70 bg-paper px-3 py-2">
        <RefBlock label="Invoice" value={row.invoiceRef} />
        <RefBlock label="Razorpay payment" value={row.razorpayPaymentId} />
        <RefBlock label="Razorpay order" value={row.razorpayOrderId} />
      </div>
    </article>
  );
}

export default function PaymentsManagementPanel({ payments = [], paymentStats = {} }) {
  const [filters, setFilters] = useState({ q: "", status: "", plan: "" });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return payments.filter((row) => {
      if (filters.status && row.paymentStatus !== filters.status) return false;
      if (filters.plan && row.plan !== filters.plan) return false;
      if (!q) return true;
      const haystack = [
        row.id,
        row.business,
        row.owner,
        row.ownerEmail,
        row.ownerPhone,
        row.invoiceRef,
        row.razorpayOrderId,
        row.razorpayPaymentId
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [payments, filters]);

  const activeFilterCount = [filters.q, filters.status, filters.plan].filter(Boolean).length;
  const clearFilters = () => setFilters({ q: "", status: "", plan: "" });

  const stats = {
    total: paymentStats.total ?? payments.length,
    paid: paymentStats.paid ?? payments.filter((p) => p.paymentStatus === "Paid").length,
    pending: paymentStats.pending ?? payments.filter((p) => p.paymentStatus === "Pending").length,
    revenuePaise:
      paymentStats.revenuePaise ??
      payments.filter((p) => p.paymentStatus === "Paid").reduce((sum, p) => sum + (p.amountPaise || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="admin-user-stats">
        <StatCard label="Total transactions" value={stats.total} accent="bg-teal" />
        <StatCard label="Paid" value={stats.paid} accent="bg-emerald-500" highlight="text-teal" />
        <StatCard
          label="Pending"
          value={stats.pending}
          accent="bg-saffron"
          highlight={stats.pending > 0 ? "text-amber-600" : ""}
        />
        <StatCard
          label="Total revenue"
          value={formatRupee(stats.revenuePaise)}
          accent="bg-sky-500"
          highlight="text-teal-dark"
        />
      </div>

      <div className="admin-data-table-wrap">
        <div className="admin-data-table-header">
          <div className="filter-toolbar-top">
            <div>
              <h2 className="text-subtitle">Payment records</h2>
              <p className="text-small mt-0.5 text-muted">
                {filtered.length} record{filtered.length === 1 ? "" : "s"}
                {activeFilterCount > 0 ? " matching filters" : ""}
              </p>
            </div>
          </div>

          <div className="filter-toolbar-top mt-4">
            <div className="filter-search-wrap">
              <svg className="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="filter-search-input"
                type="search"
                placeholder="Search business, owner, invoice, Razorpay ID..."
                value={filters.q}
                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
              />
            </div>
            <div className="filter-toolbar-actions">
              <label className="filter-select-wrap">
                <span className="sr-only">Status</span>
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s || "all"} value={s}>{s || "All statuses"}</option>
                  ))}
                </select>
              </label>
              <label className="filter-select-wrap">
                <span className="sr-only">Plan</span>
                <select
                  className="filter-select"
                  value={filters.plan}
                  onChange={(e) => setFilters((p) => ({ ...p, plan: e.target.value }))}
                >
                  {PLAN_FILTERS.map((p) => (
                    <option key={p || "all"} value={p}>{p || "All plans"}</option>
                  ))}
                </select>
              </label>
              {activeFilterCount > 0 && (
                <button type="button" className="filter-panel-reset" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="active-filter-pills mt-4 border-t-0 pt-0">
              {filters.q && (
                <span className="active-filter-pill">
                  Search: {filters.q}
                  <button type="button" aria-label="Remove search filter" onClick={() => setFilters((p) => ({ ...p, q: "" }))}>×</button>
                </span>
              )}
              {filters.status && (
                <span className="active-filter-pill">
                  Status: {filters.status}
                  <button type="button" aria-label="Remove status filter" onClick={() => setFilters((p) => ({ ...p, status: "" }))}>×</button>
                </span>
              )}
              {filters.plan && (
                <span className="active-filter-pill">
                  Plan: {filters.plan}
                  <button type="button" aria-label="Remove plan filter" onClick={() => setFilters((p) => ({ ...p, plan: "" }))}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {!filtered.length ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <p className="text-subtitle">No payment records found</p>
            <p className="text-body mt-1 max-w-sm text-muted">
              {activeFilterCount > 0
                ? "Try adjusting your search or filters."
                : "Payments will appear here when business owners upgrade their listing plans."}
            </p>
            {activeFilterCount > 0 && (
              <button type="button" className="btn-ghost btn-inline mt-4" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((row) => (
                <PaymentMobileCard key={row.id} row={row} />
              ))}
            </div>

            <div className="table-scroll hidden md:block">
              <table className="admin-data-table min-w-[1040px]">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Business &amp; owner</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Dates</th>
                    <th>Payment refs</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <p className="text-caption font-mono text-muted">{row.id}</p>
                        <p className="text-small mt-0.5 text-muted">Created {formatDate(row.createdAt)}</p>
                      </td>
                      <td>
                        <p className="text-body font-bold">{row.business}</p>
                        <p className="text-small mt-0.5 text-muted">{row.owner || "—"}</p>
                        <p className="text-caption text-muted">
                          {row.ownerEmail || row.ownerPhone || row.userId || "—"}
                        </p>
                      </td>
                      <td>
                        <span className={`text-caption inline-flex rounded-full px-2.5 py-1 font-semibold ${planBadgeClass(row.plan)}`}>
                          {row.plan}
                        </span>
                        <p className="text-body mt-1 font-semibold text-teal-dark">{row.amount}</p>
                      </td>
                      <td>
                        <PaymentStatusBadge status={row.paymentStatus} />
                      </td>
                      <td className="text-small">
                        <p>Paid: <span className="text-ink">{formatDate(row.paidAt)}</span></p>
                        <p className="mt-0.5 text-muted">Renews: {formatDate(row.renewsOn)}</p>
                      </td>
                      <td className="text-caption space-y-1">
                        <RefBlock label="Invoice" value={row.invoiceRef} />
                        <RefBlock label="Payment" value={row.razorpayPaymentId} />
                        <RefBlock label="Order" value={row.razorpayOrderId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
