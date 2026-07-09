import { BUSINESS_GROUPS, LEGACY_BUSINESS_TYPES } from "../../utils/constants";

export default function CategorySelect({
  value,
  onChange,
  className = "input-field",
  includeAll = false,
  required = false
}) {
  return (
    <select className={className} value={value} onChange={onChange} required={required}>
      {includeAll && <option value="">All categories</option>}
      {BUSINESS_GROUPS.map((group) => (
        <optgroup key={group.group} label={group.group}>
          {group.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </optgroup>
      ))}
      <optgroup label="Other Local Services">
        {LEGACY_BUSINESS_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
