import { kycStatusMeta } from "../../utils/kycConstants";

export default function KycStatusBadge({ status, className = "" }) {
  const meta = kycStatusMeta(status);
  return (
    <span className={`text-caption inline-flex rounded-full px-2.5 py-1 font-bold ${meta.className} ${className}`}>
      {meta.label}
    </span>
  );
}
