"use client";

import Link from "next/link";
import { telLink, whatsappLink } from "../../utils/constants";
import { directionsLink, shareBusiness } from "../../utils/businessHelpers";
import { setContactState } from "../../utils/navigation";
import {
  DetailsIcon,
  DirectionsIcon,
  PhoneIcon,
  ReportIcon,
  ShareIcon,
  WhatsAppIcon
} from "../common/ActionIcons";

export default function BusinessActions({ business, onLead, compact = false, hideDetails = false }) {
  const handleShare = async () => {
    try {
      await shareBusiness(business);
    } catch {
      // user cancelled share
    }
  };

  const btnClass = compact ? "business-action-btn business-action-btn-sm" : "business-action-btn";

  return (
    <div className={`business-actions ${compact ? "business-actions-compact" : ""}`}>
      <a
        href={telLink(business.phone)}
        className={`${btnClass} business-action-primary`}
        onClick={() => onLead?.("Call")}
        aria-label="Call now"
        title="Call now"
      >
        <PhoneIcon />
      </a>
      <a
        href={whatsappLink(business.phone, `Hi ${business.name}, I found you on India Local Connect.`)}
        target="_blank"
        rel="noreferrer"
        className={btnClass}
        onClick={() => onLead?.("WhatsApp")}
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <a
        href={directionsLink(business)}
        target="_blank"
        rel="noreferrer"
        className={btnClass}
        onClick={() => onLead?.("Direction")}
        aria-label="Get directions"
        title="Directions"
      >
        <DirectionsIcon />
      </a>
      {!hideDetails && (
        <Link
          href={`/business/${business.slug}`}
          className={`${btnClass} business-action-primary`}
          aria-label="View details"
          title="View details"
        >
          <DetailsIcon />
        </Link>
      )}
      <button
        type="button"
        className={btnClass}
        onClick={handleShare}
        aria-label="Share business"
        title="Share"
      >
        <ShareIcon />
      </button>
      <Link
        href="/contact"
        className={btnClass}
        onClick={() => setContactState({ subject: "Report listing", business: business.name })}
        aria-label="Report listing"
        title="Report"
      >
        <ReportIcon />
      </Link>
    </div>
  );
}
