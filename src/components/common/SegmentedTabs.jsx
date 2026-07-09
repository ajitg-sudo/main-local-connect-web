export default function SegmentedTabs({ items, value, onChange, className = "" }) {
  return (
    <div className={`segmented-tabs ${className}`} role="tablist" aria-label="Section tabs">
      {items.map((item) => {
        const active = value === item.key;
        const badge = item.badge > 0 ? item.badge : null;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={`segmented-tab ${active ? "segmented-tab-active" : ""}`}
          >
            <span>{item.label}</span>
            {badge ? <span className="segmented-tab-badge">{badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
