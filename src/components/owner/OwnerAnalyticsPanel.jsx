import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { canAccessAnalytics } from "../../utils/planLimits";

export default function OwnerAnalyticsPanel({ business }) {
  const { error: toastError } = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = business?.premium || business?.plan || "Free";
  const unlocked = canAccessAnalytics(plan);

  useEffect(() => {
    if (!business?.id || !unlocked) {
      setData(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    api
      .ownerAnalytics(business.id)
      .then(setData)
      .catch((err) => {
        setError(err.message);
        toastError(err.message);
      })
      .finally(() => setLoading(false));
  }, [business?.id, unlocked, toastError]);

  if (!business) return null;

  if (!unlocked) {
    return (
      <div className="card border-dashed border-line bg-paper">
        <p className="text-subtitle">Listing analytics</p>
        <p className="text-body mt-2 text-muted">
          See profile views and WhatsApp, call, and direction leads on Premium or Featured plans.
        </p>
        <p className="text-small mt-3 text-muted">
          Your current plan: <strong className="text-ink">{plan}</strong>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <p className="text-body text-muted">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="text-body text-rose">{error}</p>
      </div>
    );
  }

  const breakdown = data?.leads?.breakdown || {};
  const recent = data?.leads?.recent || [];

  return (
    <div className="card">
      <h2 className="text-subtitle">Listing analytics</h2>
      <p className="text-body mt-1 text-muted">{business.name}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-paper px-3 py-2.5">
          <p className="text-caption text-muted">Profile views</p>
          <p className="text-stat mt-0.5">{data?.views ?? 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3 py-2.5">
          <p className="text-caption text-muted">Total leads</p>
          <p className="text-stat mt-0.5">{data?.leads?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3 py-2.5">
          <p className="text-caption text-muted">WhatsApp</p>
          <p className="text-stat mt-0.5">{breakdown.WhatsApp || 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper px-3 py-2.5">
          <p className="text-caption text-muted">Calls</p>
          <p className="text-stat mt-0.5">{breakdown.Call || 0}</p>
        </div>
      </div>

      {!!recent.length && (
        <div className="mt-4">
          <p className="text-label mb-2">Recent leads</p>
          <div className="space-y-2">
            {recent.slice(0, 8).map((lead) => (
              <div key={lead.id} className="text-small flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                <span className="font-medium text-ink">{lead.type}</span>
                <span className="text-muted">{lead.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!recent.length && (
        <p className="text-small mt-4 text-muted">
          No leads yet. They appear when customers tap Call, WhatsApp, or Directions on your listing.
        </p>
      )}
    </div>
  );
}
