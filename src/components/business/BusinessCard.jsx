"use client";

import Link from "next/link";
import Badge from "../common/Badge";
import BusinessAvatar from "./BusinessAvatar";
import DealQuestPanel from "./DealQuestPanel";
import BusinessActions from "./BusinessActions";
import { planBadgeClass } from "../../utils/constants";
import { api } from "../../services/api";

export default function BusinessCard({ business }) {
  const recordLead = async (type) => {
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

  const detailHref = `/business/${business.slug}`;

  return (
    <article className="business-card">
      <header className="business-card-top">
        <Link href={detailHref} className="shrink-0 rounded-full focus-visible:outline-offset-4">
          <BusinessAvatar business={business} variant="circle" />
        </Link>
        <div className="business-card-head">
          <h3 className="business-card-name">
            <Link href={detailHref} className="business-card-link">
              {business.name}
            </Link>
          </h3>
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
          {(business.owner || business.hours || business.phone) && (
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
                  {business.owner && <span className="business-card-dot" aria-hidden="true" />}
                  <span className="whitespace-nowrap">WhatsApp: {business.phone}</span>
                </>
              )}
            </p>
          )}
        </div>

        <DealQuestPanel business={business} />
        <BusinessActions business={business} onLead={recordLead} />
      </div>
    </article>
  );
}
