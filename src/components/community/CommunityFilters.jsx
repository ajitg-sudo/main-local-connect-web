import { useMemo } from "react";
import SegmentedTabs from "../common/SegmentedTabs";

export default function CommunityFilters({ filters, meta, onChange, onReset }) {
  const categoryTabs = useMemo(
    () => [
      { key: "", label: "All" },
      ...meta.categories.map((cat) => ({ key: cat, label: cat }))
    ],
    [meta.categories]
  );

  const activeCount = [filters.q, filters.city, filters.category].filter(Boolean).length;

  return (
    <div className="filter-toolbar">
      <div className="filter-toolbar-top">
        <div className="filter-search-wrap">
          <svg className="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            className="filter-search-input"
            type="search"
            placeholder="Search communities by name, city, or topic..."
            value={filters.q}
            onChange={(e) => onChange("q", e.target.value)}
          />
        </div>
        <div className="filter-toolbar-actions">
          <label className="filter-select-wrap">
            <span className="sr-only">City</span>
            <select
              className="filter-select"
              value={filters.city}
              onChange={(e) => onChange("city", e.target.value)}
            >
              <option value="">All cities</option>
              {meta.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>
          {activeCount > 0 && (
            <button type="button" className="filter-panel-reset" onClick={onReset}>
              Clear
            </button>
          )}
        </div>
      </div>

      {categoryTabs.length > 1 && (
        <div className="filter-toolbar-tabs">
          <p className="filter-panel-label mb-2">Browse by category</p>
          <SegmentedTabs
            items={categoryTabs}
            value={filters.category}
            onChange={(key) => onChange("category", key)}
          />
        </div>
      )}

      {activeCount > 0 && (
        <div className="active-filter-pills">
          {filters.q && (
            <span className="active-filter-pill">
              Search: {filters.q}
              <button type="button" aria-label="Remove search filter" onClick={() => onChange("q", "")}>×</button>
            </span>
          )}
          {filters.city && (
            <span className="active-filter-pill">
              {filters.city}
              <button type="button" aria-label="Remove city filter" onClick={() => onChange("city", "")}>×</button>
            </span>
          )}
          {filters.category && (
            <span className="active-filter-pill">
              {filters.category}
              <button type="button" aria-label="Remove category filter" onClick={() => onChange("category", "")}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
