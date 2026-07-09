"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { filterBusinesses, rankBusinesses, uniqueAreas } from "../../utils/helpers";
import { canListBusiness } from "../../utils/user";
import SearchPanel from "../../components/business/SearchPanel";
import BusinessFiltersPanel from "../../components/business/BusinessFiltersPanel";
import BusinessCard from "../../components/business/BusinessCard";
import AdBanner from "../../components/ads/AdBanner";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { DISCOVER_INTERLINKS } from "../../utils/interlinks";

const defaultFilters = {
  q: "",
  city: "",
  area: "",
  category: "",
  openNow: false,
  verifiedOnly: false,
  premium: "",
  minRating: ""
};

export default function HomePage() {
  const { user, isOwner } = useAuth();
  const showListBusiness = canListBusiness(user, { isOwner });
  const [businesses, setBusinesses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [sidebarAds, setSidebarAds] = useState([]);
  const [inlineAds, setInlineAds] = useState([]);
  const [heroAds, setHeroAds] = useState([]);
  const [footerAds, setFooterAds] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([api.businesses(), api.testimonials()])
      .then(([biz, tests]) => {
        setBusinesses(biz);
        setTestimonials(tests);
        setLoadError("");
      })
      .catch((err) => {
        setBusinesses([]);
        setTestimonials([]);
        setLoadError(err.message || "Could not load directory data.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const city = filters.city || "";
    Promise.all([
      api.ads({ position: "Sidebar", ...(city ? { city } : {}) }),
      api.ads({ position: "Results Inline", ...(city ? { city } : {}) }),
      api.ads({ position: "Hero Banner", ...(city ? { city } : {}) }),
      api.ads({ position: "Footer Strip", ...(city ? { city } : {}) })
    ])
      .then(([sidebar, inline, hero, footer]) => {
        setSidebarAds(sidebar);
        setInlineAds(inline);
        setHeroAds(hero);
        setFooterAds(footer);
      })
      .catch(() => {
        setSidebarAds([]);
        setInlineAds([]);
        setHeroAds([]);
        setFooterAds([]);
      });
  }, [filters.city]);

  const areas = useMemo(() => uniqueAreas(businesses, filters.city), [businesses, filters.city]);

  const results = useMemo(
    () => rankBusinesses(filterBusinesses(businesses, filters)),
    [businesses, filters]
  );

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...(key === "city" ? { area: "" } : {}) }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNearMe = () => {
    setFilters((prev) => ({ ...prev, openNow: true, verifiedOnly: true }));
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetSidebarFilters = () => {
    setFilters((prev) => ({
      ...prev,
      openNow: false,
      verifiedOnly: false,
      category: "",
      minRating: "",
      premium: ""
    }));
  };

  const activeSearchTags = [
    filters.q && { key: "q", label: `"${filters.q}"` },
    filters.city && { key: "city", label: filters.city },
    filters.area && { key: "area", label: filters.area },
    filters.category && { key: "category", label: filters.category },
    filters.openNow && { key: "openNow", label: "Open now" },
    filters.verifiedOnly && { key: "verifiedOnly", label: "Verified" },
    filters.premium && { key: "premium", label: filters.premium },
    filters.minRating && { key: "minRating", label: `${filters.minRating}+ rating` }
  ].filter(Boolean);

  if (loading) {
    return <div className="text-body flex min-h-[50vh] items-center justify-center px-4 text-muted">Loading directory...</div>;
  }

  return (
    <div>
      <section
        className="bg-[linear-gradient(90deg,rgba(8,20,48,0.92),rgba(8,20,48,0.62),rgba(8,20,48,0.34)),linear-gradient(135deg,#1e3a8a,#2563eb)] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-14"
        aria-labelledby="home-hero-title"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-sky-200">Made for Indian shops, vendors, and home service providers</p>
          <h1 id="home-hero-title" className="heading-page mt-3 max-w-3xl text-balance">
            Find trusted local businesses in every city, town, and village.
          </h1>
          <p className="text-lead mt-4 max-w-2xl text-white/85">
            Search shops, repair services, tutors, medical stores, salons, food carts, freelancers, and more with WhatsApp-first contact.
          </p>
          <div className="mt-6 sm:mt-8">
            <SearchPanel
              filters={filters}
              areas={areas}
              onChange={updateFilter}
              onSubmit={handleSearch}
              onNearMe={handleNearMe}
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link href="/categories" className="btn-ghost border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              Browse categories
            </Link>
            {showListBusiness && (
              <Link href="/list-business" className="btn-ghost border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                List your business
              </Link>
            )}
            <Link href="/communities" className="btn-ghost border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              Join communities
            </Link>
            <Link href="/" className="btn-ghost border-amber-300/50 bg-amber-400/20 text-white hover:bg-amber-400/30 sm:w-auto">
              Win discounts on business cards
            </Link>
          </div>
        </div>
      </section>

      {!!heroAds.length && (
        <section className="page-container -mt-2 pb-4 sm:-mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {heroAds.slice(0, 2).map((ad) => (
              <AdBanner key={ad.id} ad={ad} placement="Hero Banner" />
            ))}
          </div>
        </section>
      )}

      <section id="results" className="page-section">
        {loadError && (
          <div className="card mb-6 border-rose/20 bg-rose/5 text-center text-rose">
            <p className="text-body">{loadError}</p>
            <p className="text-small mt-2 text-muted">
              Make sure the backend is running on port 5000, then refresh this page.
            </p>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <BusinessFiltersPanel
            filters={filters}
            onChange={updateFilter}
            onReset={resetSidebarFilters}
            sponsored={
              !!sidebarAds.length ? (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted">Sponsored</p>
                  {sidebarAds.map((ad) => (
                    <AdBanner key={ad.id} ad={ad} placement="Sidebar" />
                  ))}
                </div>
              ) : null
            }
          />
          <div className="min-w-0">
            <div className="results-toolbar">
              <div>
                <p className="eyebrow">Directory</p>
                <h2 className="heading-section">Local results</h2>
              </div>
              <span className="text-body font-medium text-muted">{results.length} businesses</span>
            </div>

            {!!activeSearchTags.length && (
              <div className="active-filter-pills mb-4">
                {activeSearchTags.map((tag) => (
                  <span key={tag.key} className="active-filter-pill">
                    {tag.label}
                    <button
                      type="button"
                      aria-label={`Remove ${tag.label} filter`}
                      onClick={() => updateFilter(tag.key, tag.key === "openNow" || tag.key === "verifiedOnly" ? false : "")}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {!!inlineAds.length && (
              <div className="mb-4 space-y-3">
                <p className="text-caption font-semibold uppercase tracking-wide text-muted">Sponsored</p>
                {inlineAds.map((ad) => (
                  <AdBanner key={ad.id} ad={ad} placement="Results Inline" />
                ))}
              </div>
            )}
            <div className="space-y-4">
              {results.map((b) => (
                <BusinessCard key={b.id || b.slug} business={b} />
              ))}
              {!results.length && !inlineAds.length && (
                <p className="text-body text-muted">No businesses match your filters.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {!!footerAds.length && (
        <section className="page-container pb-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {footerAds.map((ad) => (
              <AdBanner key={ad.id} ad={ad} placement="Footer Strip" />
            ))}
          </div>
        </section>
      )}

      <section className="page-section pt-0">
        <div className="card flex flex-col gap-4 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-amber-800">Play &amp; win</p>
            <h2 className="heading-section">Win percent-off coupons per business</h2>
            <p className="text-body mt-2 max-w-xl text-muted">
              Open any listing, play a mini-game on that card, and unlock a 5–20% discount code for that shop only.
            </p>
          </div>
          <Link href="/#results" className="btn-primary shrink-0 sm:min-w-[180px]">
            Browse listings
          </Link>
        </div>
      </section>

      {!!testimonials.length && (
        <section className="page-section pt-0">
          <h2 className="heading-section">Trusted by local owners</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="card">
                <p className="text-lead">"{t.quote}"</p>
                <footer className="text-small mt-3 font-medium text-muted">— {t.name}, {t.city}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}
      <section className="page-section pt-0">
        <PageInterlinks title="Explore India Local Connect" links={DISCOVER_INTERLINKS} />
      </section>
    </div>
  );
}
