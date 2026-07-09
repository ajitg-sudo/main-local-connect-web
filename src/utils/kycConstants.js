export const KYC_STATUS_META = {
  draft: { label: "Draft", className: "bg-line text-muted" },
  submitted: { label: "Under review", className: "bg-amber-100 text-amber-900" },
  approved: { label: "Verified", className: "bg-teal/15 text-teal-dark" },
  rejected: { label: "Rejected", className: "bg-rose/15 text-rose" },
  resubmit_required: { label: "Resubmit required", className: "bg-saffron/15 text-amber-900" }
};

export const KYC_DOC_FIELDS = [
  { key: "aadhaarDocUrl", label: "Aadhaar card", hint: "Clear photo or PDF of Aadhaar (front). Max 8 MB.", required: true },
  { key: "panDocUrl", label: "PAN card", hint: "Photo or PDF of PAN card. Max 8 MB.", required: true },
  { key: "shopPhotoUrl", label: "Shop / business photo", hint: "Storefront or workplace photo with visible signage.", required: true },
  { key: "gstDocUrl", label: "GST certificate", hint: "Required only if you enter a GSTIN below.", required: false },
  { key: "shopLicenseUrl", label: "Shop license / Udyam", hint: "Trade license, Udyam, or municipal permit (optional).", required: false },
  { key: "ownerPhotoUrl", label: "Owner photo with ID", hint: "Selfie holding Aadhaar or PAN (optional, speeds review).", required: false }
];

export function kycStatusMeta(status) {
  return KYC_STATUS_META[status] || { label: status || "Unknown", className: "bg-line text-muted" };
}
