import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import FormField from "../common/FormField";
import KycStatusBadge from "../common/KycStatusBadge";
import { KYC_DOC_FIELDS } from "../../utils/kycConstants";
import { resolveMediaUrl } from "../../utils/media";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Under review" },
  { value: "resubmit_required", label: "Resubmit required" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" }
];

function DocPreview({ label, url }) {
  if (!url) return null;
  const full = resolveMediaUrl(url);
  const isPdf = url.toLowerCase().includes(".pdf");
  return (
    <div className="rounded-lg border border-line p-3">
      <p className="text-label">{label}</p>
      {isPdf ? (
        <a href={full} target="_blank" rel="noreferrer" className="text-body mt-2 inline-block font-bold text-teal">
          Open PDF
        </a>
      ) : (
        <a href={full} target="_blank" rel="noreferrer">
          <img src={full} alt={label} className="mt-2 max-h-40 rounded-lg border border-line object-cover" />
        </a>
      )}
    </div>
  );
}

export default function KycReviewPanel() {
  const { success, error: toastError } = useToast();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", q: "", queue: true });
  const [selected, setSelected] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        api.adminKycStats(),
        api.adminKycList({
          status: filters.status || undefined,
          q: filters.q || undefined,
          queue: filters.queue ? "true" : undefined
        })
      ]);
      setStats(statsRes);
      setApplications(listRes.applications || []);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (id) => {
    try {
      const app = await api.adminKycGet(id);
      setSelected(app);
      setReviewNotes(app.adminNotes || "");
      setRejectionReason("");
    } catch (err) {
      toastError(err.message);
    }
  };

  const runReview = async (action) => {
    if (!selected) return;
    setReviewing(true);
    try {
      const res = await api.adminKycReview(selected.id, {
        action,
        notes: reviewNotes,
        rejectionReason: action === "approve" ? undefined : rejectionReason
      });
      success(res.message);
      setSelected(null);
      await load();
    } catch (err) {
      toastError(err.message);
    } finally {
      setReviewing(false);
    }
  };

  const canReview = selected && ["submitted", "resubmit_required"].includes(selected.status);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card">
          <p className="text-caption text-muted">Review queue</p>
          <p className="text-stat text-rose">{stats?.queue ?? "—"}</p>
        </div>
        <div className="card">
          <p className="text-caption text-muted">Under review</p>
          <p className="text-stat">{stats?.pending ?? "—"}</p>
        </div>
        <div className="card">
          <p className="text-caption text-muted">Approved</p>
          <p className="text-stat text-teal">{stats?.approved ?? "—"}</p>
        </div>
        <div className="card">
          <p className="text-caption text-muted">Resubmit</p>
          <p className="text-stat">{stats?.resubmit ?? "—"}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-subtitle">KYC applications</h2>
            <p className="text-body mt-1 text-muted">Review owner identity documents before publishing listings.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              className="input-field"
              placeholder="Search owner, business, PAN..."
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
            />
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, queue: !e.target.value }))}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value || "all"} value={f.value}>{f.label}</option>
              ))}
            </select>
            <label className="text-small flex items-center gap-2 px-1 text-muted">
              <input
                type="checkbox"
                checked={filters.queue}
                onChange={(e) => setFilters((p) => ({ ...p, queue: e.target.checked, status: e.target.checked ? "" : p.status }))}
              />
              Queue only
            </label>
          </div>
        </div>

        {loading ? (
          <p className="text-body mt-4 text-muted">Loading KYC queue...</p>
        ) : (
          <div className="table-scroll mt-4">
            <table className="min-w-[880px] w-full text-left">
              <thead>
                <tr className="text-label border-b border-line">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Business</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">PAN</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Submitted</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((row) => (
                  <tr key={row.id} className="text-body border-b border-line/70 align-top">
                    <td className="px-3 py-3 font-mono text-caption">{row.id}</td>
                    <td className="px-3 py-3">
                      <p className="font-bold">{row.ownerName}</p>
                      <p className="text-caption text-muted">{row.userEmail || row.phone}</p>
                    </td>
                    <td className="px-3 py-3">{row.businessName || "—"}</td>
                    <td className="px-3 py-3">{row.city || "—"}</td>
                    <td className="px-3 py-3 font-mono text-small">{row.panNumber || "—"}</td>
                    <td className="px-3 py-3"><KycStatusBadge status={row.status} /></td>
                    <td className="px-3 py-3 text-small text-muted">
                      {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <button type="button" className="btn-ghost btn-inline text-xs" onClick={() => openDetail(row.id)}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!applications.length && (
              <p className="text-body px-3 py-4 text-muted">No KYC applications match your filters.</p>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="card border-teal/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-caption font-mono text-muted">{selected.id} · v{selected.version}</p>
              <h3 className="text-subtitle mt-1">{selected.ownerName}</h3>
              <p className="text-body text-muted">
                {selected.businessName} · {selected.city} · {selected.phone}
              </p>
            </div>
            <KycStatusBadge status={selected.status} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-bg p-3">
              <p className="text-caption text-muted">PAN</p>
              <p className="text-body font-mono font-bold">{selected.panNumber || "—"}</p>
            </div>
            <div className="rounded-lg bg-bg p-3">
              <p className="text-caption text-muted">Aadhaar</p>
              <p className="text-body font-mono font-bold">XXXX-XXXX-{selected.aadhaarLast4 || "----"}</p>
            </div>
            <div className="rounded-lg bg-bg p-3">
              <p className="text-caption text-muted">GSTIN</p>
              <p className="text-body font-mono font-bold">{selected.gstin || "Not provided"}</p>
            </div>
          </div>

          {selected.rejectionReason && (
            <p className="text-body mt-4 rounded-lg bg-rose/5 px-3 py-2 text-rose">
              Previous feedback: {selected.rejectionReason}
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {KYC_DOC_FIELDS.map((doc) => (
              <DocPreview key={doc.key} label={doc.label} url={selected[doc.key]} />
            ))}
          </div>

          {canReview && (
            <div className="mt-6 grid gap-4 border-t border-line pt-6 lg:grid-cols-2">
              <FormField label="Internal admin notes (optional)">
                <textarea
                  className="input-field min-h-[80px]"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Notes visible to admins only"
                />
              </FormField>
              <FormField label="Message to owner (required for reject / resubmit)">
                <textarea
                  className="input-field min-h-[80px]"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. PAN image is blurry — please re-upload"
                />
              </FormField>
              <div className="flex flex-wrap gap-2 lg:col-span-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={reviewing}
                  onClick={() => runReview("approve")}
                >
                  {reviewing ? "Processing..." : "Approve KYC"}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={reviewing}
                  onClick={() => runReview("request_resubmit")}
                >
                  Request resubmit
                </button>
                <button
                  type="button"
                  className="btn-ghost text-rose"
                  disabled={reviewing}
                  onClick={() => runReview("reject")}
                >
                  Reject
                </button>
                <button type="button" className="btn-ghost" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {!canReview && (
            <div className="mt-4 flex gap-2">
              <button type="button" className="btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
