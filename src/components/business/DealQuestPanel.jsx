"use client";

import Link from "next/link";
import { dealPointsFor } from "../../utils/businessHelpers";

export default function DealQuestPanel({ business }) {
  const points = dealPointsFor(business);
  const playPath = `/play-offers?business=${encodeURIComponent(business.slug)}`;

  return (
    <div className="deal-quest">
      <div className="deal-quest-header">
        <span className="deal-quest-label">Deal quest</span>
        <span className="deal-quest-title">Win a discount coupon</span>
      </div>
      <div className="deal-quest-body">
        <p className="deal-quest-points">{points} points</p>
        <p className="deal-quest-headline">
          Sign in, play a mini-game, and unlock <strong>5–20% off</strong> at {business.name}. Coupon emailed to you and the owner.
        </p>
        <Link href={playPath} className="deal-quest-play">
          Play game &amp; win discount
        </Link>
      </div>
    </div>
  );
}
