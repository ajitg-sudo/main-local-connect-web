import { planUsageLabel } from "../../utils/planLimits";
import { planBadgeClass } from "../../utils/constants";

export default function PlanUsageBanner({ business, offeringCount }) {
  const usage = business?.planUsage;
  if (!usage) return null;

  const { plan, limits, usage: counts } = usage;
  const photosLabel = planUsageLabel(counts.photos, limits.maxPhotos);
  const offeringsLabel = planUsageLabel(offeringCount ?? counts.offerings, limits.maxOfferings);

  return (
    <div className="card border-teal/20 bg-teal/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Your plan</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`text-caption rounded-full px-2.5 py-1 font-semibold ${planBadgeClass(plan)}`}>
              {plan}
            </span>
            <span className="text-small text-muted">Photos: {photosLabel}</span>
            <span className="text-small text-muted">Offerings: {offeringsLabel}</span>
          </div>
        </div>
        {plan !== "Featured" && (
          <p className="text-caption text-teal-dark">Upgrade options below</p>
        )}
      </div>
      {plan === "Free" && (
        <p className="text-small mt-2 text-muted">
          Upgrade to Premium for more photos, offerings, and a lead dashboard with listing analytics.
        </p>
      )}
    </div>
  );
}
