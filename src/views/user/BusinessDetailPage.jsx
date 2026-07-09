"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import Badge from "../../components/common/Badge";
import BusinessAvatar from "../../components/business/BusinessAvatar";
import DealQuestPanel from "../../components/business/DealQuestPanel";
import BusinessActions from "../../components/business/BusinessActions";
import { planBadgeClass } from "../../utils/constants";
import { parseGallery } from "../../utils/planLimits";
import { useBreadcrumbLabels } from "../../context/breadcrumbContext";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { businessInterlinks } from "../../utils/interlinks";
import { resolveMediaUrl } from "../../utils/media";

export default function BusinessDetailPage() {
  const { slug } = useParams();
  const { error: toastError } = useToast();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState("");

  useBreadcrumbLabels(
    business
      ? {
          [`business:${slug}`]: business.name,
          businessCategory: business.category,
          businessName: business.name
        }
      : {}
  );

  useEffect(() => {
    api.businessBySlug(slug)
      .then(setBusiness)
      .catch((err) => {
        setError(err.message);
        toastError(err.message);
      });
  }, [slug, toastError]);

  const recordLead = async (type) => {
    if (!business) return;
    try {
      await api.createLead({
        business: business.name,
        businessId: business.id,
        type,
        phone: business.phone,
        owner: business.owner,
        city: business.city,
        visitor: "Website visitor"
      });
    } catch {
      // non-blocking
    }
  };

  if (error) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-rose">{error}</p>
        <Link href="/" className="btn-primary btn-inline mt-4">Back home</Link>
      </div>
    );
  }

  if (!business) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 text-muted">Loading...</div>;
  }

  const gallery = parseGallery(business.galleryUrls);

  return (
    <section className="page-section">
      <article className="business-card">
        <header className="business-card-top">
          <BusinessAvatar business={business} variant="circle" className="h-16 w-16 sm:h-20 sm:w-20" />
          <div className="business-card-head">
            <h1 className="heading-section business-card-name">{business.name}</h1>
            <div className="business-card-badges">
              <Badge className={planBadgeClass(business.premium)}>{business.premium}</Badge>
              {business.verified && <Badge className="bg-sky-50 text-sky-700">Verified</Badge>}
            </div>
          </div>
        </header>

        <div className="business-card-body">
          <div className="business-card-meta-block">
            <p className="business-card-meta">
              <Link
                href={`/categories?category=${encodeURIComponent(business.category)}`}
                className="font-semibold text-teal hover:underline"
              >
                {business.category}
              </Link>
              <span className="business-card-dot" aria-hidden="true" />
              <span>{business.area}, {business.city}</span>
            </p>
            <p className="business-card-meta">
              <span className={business.open ? "business-card-open" : "business-card-closed"}>
                {business.open ? "Open now" : "Closed"}
              </span>
              <span className="business-card-dot" aria-hidden="true" />
              <span>{business.rating} rating ({business.reviews} reviews)</span>
            </p>
            <p className="business-card-meta business-card-meta-detail">
              {business.owner && <span>Owner: {business.owner}</span>}
              {business.hours && (
                <>
                  {business.owner && <span className="business-card-dot" aria-hidden="true" />}
                  <span>Hours: {business.hours}</span>
                </>
              )}
              {business.phone && (
                <>
                  <span className="business-card-dot" aria-hidden="true" />
                  <span className="whitespace-nowrap">WhatsApp: {business.phone}</span>
                </>
              )}
            </p>
          </div>

          {business.description && (
            <p className="text-body mt-3 text-muted">{business.description}</p>
          )}

          <DealQuestPanel business={business} />

          <BusinessActions business={business} onLead={recordLead} hideDetails />
        </div>
      </article>

      {!!gallery.length && (
        <div className="mt-8">
          <h2 className="text-subtitle">Photos</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((url, index) => (
              <img
                key={`${url}-${index}`}
                src={resolveMediaUrl(url)}
                alt={`${business.name} photo ${index + 1}`}
                className="aspect-square w-full rounded-xl border border-line object-cover"
                loading="lazy"
                decoding="async"
                width={320}
                height={320}
              />
            ))}
          </div>
        </div>
      )}

      {!!business.offerings?.length && (
        <div className="mt-8">
          <h2 className="text-subtitle">Products &amp; services</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {business.offerings.map((o) => (
              <div key={o.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-body font-semibold">{o.title}</h3>
                  <Badge className="bg-line text-muted">{o.type}</Badge>
                </div>
                {o.description && <p className="text-body mt-2 text-muted">{o.description}</p>}
                <p className="text-body mt-2 font-bold text-teal">
                  {o.price}
                  {o.discount && <span className="text-muted"> · {o.discount}</span>}
                </p>
                {o.couponCode && <p className="text-caption text-muted">Coupon: {o.couponCode}</p>}
                {o.validUntil && <p className="text-caption text-muted">Valid until: {o.validUntil}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      <PageInterlinks links={businessInterlinks(business)} className="mt-8" />
    </section>
  );
}
