"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import PageBanner from "../../components/layout/PageBanner";
import CommunityCard from "../../components/community/CommunityCard";
import CommunityFilters from "../../components/community/CommunityFilters";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { DISCOVER_INTERLINKS } from "../../utils/interlinks";

export default function CommunitiesPage() {
  const { error: toastError } = useToast();
  const [communities, setCommunities] = useState([]);
  const [meta, setMeta] = useState({ cities: [], categories: [] });
  const [filters, setFilters] = useState({ q: "", city: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.communities(filters);
      setCommunities(res.communities || []);
      setMeta(res.meta || { cities: [], categories: [] });
    } catch (err) {
      setError(err.message);
      toastError(err.message);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, [filters, toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ q: "", city: "", category: "" });
  };

  return (
    <div>
      <PageBanner
        eyebrow="Network"
        title="Business communities"
        subtitle="Join local owner groups to share leads, supplier tips, referrals, and area-wise updates with trusted peers."
      />

      <section className="page-section">
        <CommunityFilters
          filters={filters}
          meta={meta}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        <div className="results-toolbar">
          <div>
            <p className="eyebrow">Groups</p>
            <h2 className="heading-section">
              {loading ? "Loading communities..." : `${communities.length} active communit${communities.length === 1 ? "y" : "ies"}`}
            </h2>
          </div>
          <Link href="/login" className="btn-ghost btn-inline shrink-0">
            Sign in to join
          </Link>
        </div>

        {error && (
          <div className="card mb-6 text-center text-rose">
            <p className="text-body">{error}</p>
            <button type="button" className="btn-primary btn-inline mt-3" onClick={load}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}

        {!loading && !error && !communities.length && (
          <div className="card text-center text-muted">
            <p className="text-body">No communities match your filters.</p>
            <p className="text-small mt-2">Try clearing filters or check back after admins add new groups.</p>
            <button type="button" className="btn-ghost btn-inline mt-4" onClick={resetFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </section>
      <section className="page-section pt-0">
        <PageInterlinks links={DISCOVER_INTERLINKS} title="Explore more" />
      </section>
    </div>
  );
}
