"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminShell } from "../../context/adminShellContext";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { ADMIN_TABS, DEFAULT_ADMIN_TAB } from "../../utils/adminNav";
import CreateAdForm from "../../components/admin/CreateAdForm";
import UserManagementPanel from "../../components/admin/UserManagementPanel";
import CommunityManagementPanel from "../../components/admin/CommunityManagementPanel";
import KycReviewPanel from "../../components/admin/KycReviewPanel";
import PaymentsManagementPanel from "../../components/admin/PaymentsManagementPanel";
import PageInterlinks from "../../components/layout/PageInterlinks";

const TABLE_MAP = {
  listings: "listings",
  users: "users",
  leads: "leads",
  ads: "ads",
  testimonials: "testimonials"
};

const VALID_TABS = new Set(ADMIN_TABS.map((t) => t.key));

function rowSummary(row, tab) {
  if (tab === "ads") {
    return `${row.title} · ${row.position} · ${row.city}`;
  }
  if (tab === "users") {
    return `${row.name} · ${row.role} · ${row.email || row.phone || "no contact"}`;
  }
  return row.business || row.name || row.title || row.type || row.quote?.slice(0, 60);
}

function rowMeta(row, tab) {
  if (tab === "ads") {
    return `${row.impressions || 0} views · ${row.clicks || 0} clicks${row.expiry ? ` · expires ${row.expiry}` : ""}`;
  }
  return null;
}

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const { refreshAdminStats } = useAdminShell();
  const { success, error: toastError } = useToast();
  const [data, setData] = useState(null);

  const tab = useMemo(() => {
    const requested = searchParams.get("tab") || DEFAULT_ADMIN_TAB;
    return VALID_TABS.has(requested) ? requested : DEFAULT_ADMIN_TAB;
  }, [searchParams]);

  const section = ADMIN_TABS.find((t) => t.key === tab);

  const load = async () => {
    const res = await api.adminDashboard();
    setData(res);
    await refreshAdminStats?.();
  };

  useEffect(() => {
    load().catch((err) => toastError(err.message));
  }, []);

  const rows = data?.[tab] || [];

  const patchRow = async (id, body) => {
    try {
      await api.adminPatch(TABLE_MAP[tab], id, body);
      success("Updated successfully.");
      await load();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleAdCreated = () => {
    load();
  };

  const renderActions = (row) => {
    if (tab === "listings" && row.status === "Pending") {
      return (
        <>
          <button type="button" className="btn-primary btn-inline text-xs" onClick={() => patchRow(row.id, { status: "Approved" })}>
            Approve
          </button>
          <button type="button" className="btn-ghost btn-inline text-xs" onClick={() => patchRow(row.id, { status: "Rejected" })}>
            Reject
          </button>
        </>
      );
    }
    if (tab === "ads") {
      return row.status === "Active" ? (
        <button type="button" className="btn-ghost btn-inline text-xs" onClick={() => patchRow(row.id, { status: "Paused" })}>
          Pause
        </button>
      ) : (
        <button type="button" className="btn-primary btn-inline text-xs" onClick={() => patchRow(row.id, { status: "Active" })}>
          Activate
        </button>
      );
    }
    if (tab === "users") {
      return <span className="text-caption text-muted">Use full panel below</span>;
    }
    return null;
  };

  if (!data) {
    return <div className="text-body flex min-h-[50vh] items-center justify-center text-muted">Loading admin data...</div>;
  }

  const pendingJoins = data.communityMembers?.filter((m) => m.status === "Pending").length || 0;
  const pendingListings = data.listings?.filter((l) => l.status === "Pending").length || 0;
  const kycQueue = data.kycStats?.queue || 0;
  const paidPayments = data.paymentStats?.paid || data.subscriptions?.filter((s) => s.paymentStatus === "Paid").length || 0;
  const revenuePaise = data.paymentStats?.revenuePaise || 0;
  const revenueLabel = revenuePaise ? `₹${(revenuePaise / 100).toLocaleString("en-IN")}` : "₹0";

  return (
    <div>
      <p className="eyebrow">{tab === DEFAULT_ADMIN_TAB ? "Overview" : "Admin"}</p>
      <h1 className="heading-page">
        {tab === DEFAULT_ADMIN_TAB ? "Admin dashboard" : section?.label || "Admin"}
      </h1>
      {tab === "users" && (
        <p className="text-lead mt-2 max-w-2xl text-muted">
          Manage accounts, roles, and access across your directory.
        </p>
      )}
      {tab === "payments" && (
        <p className="text-lead mt-2 max-w-2xl text-muted">
          View plan purchases, Razorpay references, and revenue from listing upgrades.
        </p>
      )}

      {tab === DEFAULT_ADMIN_TAB && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="card"><p className="text-caption text-muted">Users</p><p className="text-stat">{data.users.length}</p></div>
          <div className="card">
            <p className="text-caption text-muted">KYC queue</p>
            <p className="text-stat">{kycQueue}</p>
            {kycQueue > 0 && <p className="text-caption text-rose">Needs review</p>}
          </div>
          <div className="card"><p className="text-caption text-muted">Listings</p><p className="text-stat">{data.listings.length}</p></div>
          <div className="card">
            <p className="text-caption text-muted">Paid plans</p>
            <p className="text-stat">{paidPayments}</p>
            <p className="text-caption text-teal-dark">{revenueLabel} revenue</p>
          </div>
          <div className="card"><p className="text-caption text-muted">Leads</p><p className="text-stat">{data.leads.length}</p></div>
          <div className="card"><p className="text-caption text-muted">Ads</p><p className="text-stat">{data.ads.length}</p></div>
          <div className="card">
            <p className="text-caption text-muted">Communities</p>
            <p className="text-stat">{data.communities.length}</p>
            {pendingJoins > 0 && <p className="text-caption text-rose">{pendingJoins} pending joins</p>}
          </div>
        </div>
      )}

      {tab === "listings" && pendingListings > 0 && (
        <p className="text-body mt-4 text-muted">
          {pendingListings} listing(s) awaiting review.
          {kycQueue > 0 && (
            <span className="text-rose"> Approve owner KYC first ({kycQueue} in queue).</span>
          )}
        </p>
      )}

      {tab === "kyc" && kycQueue > 0 && (
        <p className="text-body mt-4 text-muted">{kycQueue} KYC application(s) need review.</p>
      )}

      {tab === "ads" && (
        <div className="mt-4">
          <CreateAdForm onCreated={handleAdCreated} />
        </div>
      )}

      {tab === "users" && (
        <div className="mt-4">
          <UserManagementPanel onUpdated={load} />
        </div>
      )}

      {tab === "communities" && (
        <div className="mt-4">
          <CommunityManagementPanel onUpdated={load} />
        </div>
      )}

      {tab === "kyc" && (
        <div className="mt-4">
          <KycReviewPanel />
        </div>
      )}

      {tab === "payments" && (
        <div className="mt-4">
          <PaymentsManagementPanel
            payments={data.subscriptions || []}
            paymentStats={data.paymentStats}
          />
        </div>
      )}

      {tab !== "users" && tab !== "communities" && tab !== "kyc" && tab !== "payments" && (
      <>
      <div className="mt-4 space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="card">
            <p className="text-caption font-mono text-muted">{row.id}</p>
            <p className="text-body mt-1 font-bold">{rowSummary(row, tab)}</p>
            {rowMeta(row, tab) && <p className="text-small mt-1 text-muted">{rowMeta(row, tab)}</p>}
            <p className="text-small mt-1 text-muted">
              Status: {row.status}
              {tab === "listings" && row.verification ? ` · ${row.verification}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">{renderActions(row)}</div>
          </div>
        ))}
        {!rows.length && <p className="text-body text-muted">No records in this section.</p>}
      </div>

      <div className="card mt-4 hidden md:block">
        <div className="table-scroll">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="text-label border-b border-line">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Summary</th>
                {tab === "ads" && <th className="px-3 py-2">Stats</th>}
                <th className="px-3 py-2">Status</th>
                {tab === "listings" && <th className="px-3 py-2">Verification</th>}
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="text-body border-b border-line/70">
                  <td className="px-3 py-3 font-mono text-caption">{row.id}</td>
                  <td className="max-w-xs px-3 py-3">{rowSummary(row, tab)}</td>
                  {tab === "ads" && (
                    <td className="px-3 py-3 text-small text-muted">
                      {row.impressions || 0} views · {row.clicks || 0} clicks
                    </td>
                  )}
                  <td className="px-3 py-3">{row.status}</td>
                  {tab === "listings" && (
                    <td className="px-3 py-3 text-small text-muted">{row.verification || "—"}</td>
                  )}
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">{renderActions(row)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="text-body px-3 py-4 text-muted">No records in this section.</p>}
      </div>
      </>
      )}
      <PageInterlinks
        title="Quick links"
        links={[
          { href: "/", label: "Public directory" },
          { href: "/owner", label: "Owner dashboard" },
          { href: "/contact", label: "Contact support" }
        ]}
        className="mt-8"
      />
    </div>
  );
}
