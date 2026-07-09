"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { CATEGORIES } from "../../utils/constants";
import { filterBusinesses, rankBusinesses } from "../../utils/helpers";
import { canListBusiness } from "../../utils/user";
import PageBanner from "../../components/layout/PageBanner";
import { useBreadcrumbLabels } from "../../context/breadcrumbContext";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { categoryInterlinks } from "../../utils/interlinks";

export default function CategoriesPage() {
  const { user, isOwner } = useAuth();
  const showListBusiness = canListBusiness(user, { isOwner });
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.businesses()
      .then(setBusinesses)
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!activeCategory) return [];
    return rankBusinesses(filterBusinesses(businesses, { category: activeCategory }));
  }, [businesses, activeCategory]);

  const selectCategory = (name) => {
    const next = name ? `?category=${encodeURIComponent(name)}` : "";
    router.replace(`/categories${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 text-muted">Loading categories...</div>;
  }

  return (
    <div>
      <PageBanner
        eyebrow="Discover"
        title="Browse by category"
        subtitle="Find electricians, salons, medical stores, food carts, tutors, mechanics, and more near you."
      />

      <section className="page-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="heading-section">All categories</h2>
          {activeCategory && (
            <button type="button" onClick={() => selectCategory("")} className="btn-ghost btn-inline text-small">
              Clear filter
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => selectCategory(cat.name)}
              className={`overflow-hidden rounded-xl border bg-white text-left shadow-card transition hover:-translate-y-0.5 ${
                activeCategory === cat.name ? "border-teal ring-2 ring-teal/20" : "border-line"
              }`}
            >
              <img
                src={cat.photo}
                alt={cat.name}
                className="h-28 w-full object-cover sm:h-36"
                loading="lazy"
                decoding="async"
                width={400}
                height={288}
              />
              <div className="p-3 sm:p-4">
                <h3 className="text-body font-semibold">{cat.name}</h3>
                <p className="text-caption mt-1 text-muted">
                  {businesses.filter((b) => b.category === cat.name).length} listings
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {activeCategory && (
        <section className="page-section pt-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow">Results</p>
              <h2 className="heading-section">{activeCategory}</h2>
            </div>
            <span className="text-small text-muted">{results.length} businesses</span>
          </div>
          <div className="space-y-4">
            {results.map((b) => (
              <BusinessCard key={b.id || b.slug} business={b} />
            ))}
            {!results.length && (
              <div className="card text-center text-muted">
                <p>No businesses in this category yet.</p>
                {showListBusiness && (
                  <Link href="/list-business" className="btn-primary btn-inline mt-4">
                    List your business
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="page-section pt-0">
        <PageInterlinks
          title={activeCategory ? `Explore ${activeCategory}` : "Explore the directory"}
          links={categoryInterlinks(activeCategory)}
        />
      </section>
    </div>
  );
}
