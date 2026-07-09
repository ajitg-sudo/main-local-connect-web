import { PLANS, planBadgeClass } from "../../utils/constants";

export default function PlanSelector({ value, onChange, compact = false }) {
  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-3" : "space-y-4"}>
      {!compact && <h2 className="text-subtitle">Choose your plan</h2>}
      {PLANS.map((plan) => {
        const selected = value === plan.name;
        return (
          <button
            key={plan.name}
            type="button"
            onClick={() => onChange(plan.name)}
            className={`card text-left transition-all ${
              selected
                ? "border-teal ring-2 ring-teal/30"
                : "border-line hover:border-teal/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-subtitle">{plan.name}</h3>
              <span className={`text-caption rounded-full px-2 py-0.5 font-bold ${planBadgeClass(plan.name)}`}>
                {plan.name === "Free" ? "Free" : "Annual"}
              </span>
            </div>
            <p className="text-body mt-1 font-semibold text-teal">{plan.price}</p>
            <ul className="text-body mt-3 space-y-1 text-muted">
              {plan.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            {selected && (
              <p className="text-caption mt-3 font-bold text-teal-dark">Selected</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
