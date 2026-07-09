import { MAJOR_CITIES } from "../../utils/constants";
import CategorySelect from "../common/CategorySelect";

export default function SearchPanel({ filters, areas, onChange, onSubmit, onNearMe }) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-card backdrop-blur sm:grid-cols-2 sm:p-4 lg:grid-cols-4 xl:grid-cols-7"
    >
      <label className="sm:col-span-2 xl:col-span-2">
        <span className="text-label mb-1 block">What do you need?</span>
        <input
          className="input-field"
          type="search"
          placeholder="Plumber, salon, medical store..."
          value={filters.q}
          onChange={(e) => onChange("q", e.target.value)}
        />
      </label>
      <label>
        <span className="text-label mb-1 block">City</span>
        <select className="input-field" value={filters.city} onChange={(e) => onChange("city", e.target.value)}>
          <option value="">All cities</option>
          {MAJOR_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-label mb-1 block">Area</span>
        <select className="input-field" value={filters.area} onChange={(e) => onChange("area", e.target.value)}>
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-label mb-1 block">Category</span>
        <CategorySelect
          includeAll
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        />
      </label>
      <button type="submit" className="btn-primary xl:self-end">Search</button>
      <button
        type="button"
        onClick={onNearMe}
        className="btn-ghost border-amber-300 bg-amber-50 text-amber-900 xl:self-end"
      >
        Near Me
      </button>
    </form>
  );
}
