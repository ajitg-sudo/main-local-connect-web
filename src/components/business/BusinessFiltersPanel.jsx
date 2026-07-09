import { useMemo, useState } from "react";
import SegmentedTabs from "../common/SegmentedTabs";
import CategorySelect from "../common/CategorySelect";

const FILTER_TABS = [
  { key: "quick", label: "Quick" },
  { key: "category", label: "Category" },
  { key: "plan", label: "Plan" }
];

export default function BusinessFiltersPanel({ filters, onChange, onReset, sponsored }) {
  const [tab, setTab] = useState("quick");

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.openNow) count += 1;
    if (filters.verifiedOnly) count += 1;
    if (filters.category) count += 1;
    if (filters.minRating) count += 1;
    if (filters.premium) count += 1;
    return count;
  }, [filters]);

  return (
    <aside className="filter-panel lg:sticky lg:top-[calc(var(--site-header-height)+1rem)]">
      <div className="filter-panel-header">
        <div>
          <h3 className="text-subtitle">Filters</h3>
          {activeCount > 0 && (
            <p className="text-caption mt-0.5 text-muted">{activeCount} active</p>
          )}
        </div>
        {activeCount > 0 && (
          <button type="button" className="filter-panel-reset" onClick={onReset}>
            Clear all
          </button>
        )}
      </div>

      <SegmentedTabs items={FILTER_TABS} value={tab} onChange={setTab} className="mt-4" />

      {tab === "quick" && (
        <div className="filter-panel-body" role="tabpanel">
          <p className="filter-panel-label">Availability</p>
          <div className="filter-chip-group">
            <button
              type="button"
              className={`filter-chip ${filters.openNow ? "filter-chip-active" : ""}`}
              onClick={() => onChange("openNow", !filters.openNow)}
            >
              Open now
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.verifiedOnly ? "filter-chip-active" : ""}`}
              onClick={() => onChange("verifiedOnly", !filters.verifiedOnly)}
            >
              Verified only
            </button>
          </div>
        </div>
      )}

      {tab === "category" && (
        <div className="filter-panel-body" role="tabpanel">
          <label className="filter-field">
            <span className="text-label">Category</span>
            <CategorySelect
              includeAll
              className="input-field mt-1.5"
              value={filters.category}
              onChange={(e) => onChange("category", e.target.value)}
            />
          </label>
          <label className="filter-field mt-4">
            <span className="text-label">Minimum rating</span>
            <select
              className="input-field mt-1.5"
              value={filters.minRating}
              onChange={(e) => onChange("minRating", e.target.value)}
            >
              <option value="">Any rating</option>
              {[4.5, 4, 3.5].map((r) => (
                <option key={r} value={r}>{r}+ stars</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {tab === "plan" && (
        <div className="filter-panel-body" role="tabpanel">
          <label className="filter-field">
            <span className="text-label">Listing plan</span>
            <select
              className="input-field mt-1.5"
              value={filters.premium}
              onChange={(e) => onChange("premium", e.target.value)}
            >
              <option value="">All plans</option>
              <option value="Featured">Featured</option>
              <option value="Premium">Premium</option>
              <option value="Free">Free</option>
            </select>
          </label>
        </div>
      )}

      {sponsored}
    </aside>
  );
}
