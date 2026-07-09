"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import FormField from "../common/FormField";
import KycFileUpload from "../common/KycFileUpload";
import KycStatusBadge from "../common/KycStatusBadge";
import { KYC_DOC_FIELDS } from "../../utils/kycConstants";

const EMPTY_FORM = {
  businessId: "",
  ownerName: "",
  businessName: "",
  city: "",
  phone: "",
  panNumber: "",
  aadhaarLast4: "",
  gstin: "",
  legalBusinessName: "",
  aadhaarDocUrl: "",
  panDocUrl: "",
  shopPhotoUrl: "",
  gstDocUrl: "",
  shopLicenseUrl: "",
  ownerPhotoUrl: ""
};

function checklistItems(checklist) {
  if (!checklist) return [];
  return [
    { label: "PAN number", done: checklist.panNumber },
    { label: "Aadhaar last 4 digits", done: checklist.aadhaarLast4 },
    { label: "Aadhaar document", done: checklist.aadhaarDoc },
    { label: "PAN document", done: checklist.panDoc },
    { label: "Shop photo", done: checklist.shopPhoto },
    { label: "GST document", done: checklist.gstDoc, optional: checklist.optionalGstSkipped }
  ];
}

export default function KycSubmissionPanel() {
  const { success, error: toastError } = useToast();
  const [kyc, setKyc] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.kycStatus();
      setKyc(data);
      const app = data.application;
      setForm({
        businessId: app?.businessId || data.primaryBusiness?.id || "",
        ownerName: app?.ownerName || data.primaryBusiness?.owner || "",
        businessName: app?.businessName || data.primaryBusiness?.name || "",
        city: app?.city || data.primaryBusiness?.city || "",
        phone: app?.phone || "",
        panNumber: app?.panNumber || "",
        aadhaarLast4: app?.aadhaarLast4 || "",
        gstin: app?.gstin || "",
        legalBusinessName: app?.legalBusinessName || "",
        aadhaarDocUrl: app?.aadhaarDocUrl || "",
        panDocUrl: app?.panDocUrl || "",
        shopPhotoUrl: app?.shopPhotoUrl || "",
        gstDocUrl: app?.gstDocUrl || "",
        shopLicenseUrl: app?.shopLicenseUrl || "",
        ownerPhotoUrl: app?.ownerPhotoUrl || ""
      });
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const saveDraft = async () => {
    setSaving(true);
    try {
      const data = await api.kycSaveDraft(form);
      setKyc(data);
      success("KYC draft saved.");
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.kycSubmit(form);
      success(res.message || "KYC submitted for review.");
      await load();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card mt-8">
        <p className="text-body text-muted">Loading KYC verification...</p>
      </div>
    );
  }

  if (!kyc?.kycRequired && kyc?.application?.status === "approved") {
    return (
      <div className="card mt-8 border-teal/30 bg-teal/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Identity verified</p>
            <h2 className="text-subtitle mt-1">Your KYC is approved</h2>
            <p className="text-body mt-1 text-muted">
              Your business listings can be published and display the verified badge.
            </p>
          </div>
          <KycStatusBadge status="approved" />
        </div>
      </div>
    );
  }

  const app = kyc.application;
  const canEdit = kyc.canEdit;
  const checklist = checklistItems(kyc.checklist);

  return (
    <div className="card mt-8 border-teal/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">KYC verification</p>
          <h2 className="text-subtitle mt-1">Verify your business identity</h2>
          <p className="text-body mt-1 max-w-2xl text-muted">
            Upload identity and shop documents for admin review. Listings go live only after KYC is approved.
            We never store full Aadhaar numbers — only the last 4 digits.
          </p>
        </div>
        {app?.status && <KycStatusBadge status={app.status} />}
      </div>

      {kyc.userStatus === "Pending KYC" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-body font-bold text-amber-900">Account pending verification</p>
          <p className="text-small mt-1 text-amber-800">
            Complete and submit the form below. Our team typically reviews within 1–2 business days.
          </p>
        </div>
      )}

      {app?.rejectionReason && (
        <div className="mt-4 rounded-lg border border-rose/30 bg-rose/5 px-4 py-3">
          <p className="text-body font-bold text-rose">Admin feedback</p>
          <p className="text-small mt-1 text-muted">{app.rejectionReason}</p>
        </div>
      )}

      {!kyc.businesses?.length && (
        <div className="mt-4 rounded-lg border border-line bg-bg px-4 py-3">
          <p className="text-body text-muted">
            <Link href="/list-business" className="font-bold text-teal">List your business</Link> first so we can link KYC to your listing.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {kyc.businesses?.length > 1 && (
            <FormField label="Business to verify" className="sm:col-span-2">
              <select
                className="input-field"
                value={form.businessId}
                disabled={!canEdit}
                onChange={(e) => {
                  const biz = kyc.businesses.find((b) => b.id === e.target.value);
                  update("businessId", e.target.value);
                  if (biz) {
                    update("businessName", biz.name);
                    update("city", biz.city);
                  }
                }}
              >
                {kyc.businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} · {b.city} ({b.status})
                  </option>
                ))}
              </select>
            </FormField>
          )}

          <FormField label="Owner full name" required>
            <input
              className="input-field"
              required
              disabled={!canEdit}
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
            />
          </FormField>
          <FormField label="Business name" required>
            <input
              className="input-field"
              required
              disabled={!canEdit}
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          </FormField>
          <FormField label="City" required>
            <input
              className="input-field"
              required
              disabled={!canEdit}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </FormField>
          <FormField label="Phone / WhatsApp" required>
            <input
              className="input-field"
              type="tel"
              required
              disabled={!canEdit}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </FormField>
          <FormField label="PAN number" required hint="Format: ABCDE1234F">
            <input
              className="input-field uppercase"
              required
              maxLength={10}
              disabled={!canEdit}
              value={form.panNumber}
              onChange={(e) => update("panNumber", e.target.value.toUpperCase())}
            />
          </FormField>
          <FormField label="Aadhaar last 4 digits" required>
            <input
              className="input-field"
              required
              maxLength={4}
              pattern="[0-9]{4}"
              disabled={!canEdit}
              value={form.aadhaarLast4}
              onChange={(e) => update("aadhaarLast4", e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </FormField>
          <FormField label="GSTIN (optional)" hint="15-character GST number if registered">
            <input
              className="input-field uppercase"
              maxLength={15}
              disabled={!canEdit}
              value={form.gstin}
              onChange={(e) => update("gstin", e.target.value.toUpperCase())}
            />
          </FormField>
          <FormField label="Legal business name (optional)" className="sm:col-span-2">
            <input
              className="input-field"
              disabled={!canEdit}
              value={form.legalBusinessName}
              onChange={(e) => update("legalBusinessName", e.target.value)}
            />
          </FormField>

          {KYC_DOC_FIELDS.map((doc) => {
            const needsGst = doc.key === "gstDocUrl" && !form.gstin;
            if (doc.key === "gstDocUrl" && !form.gstin) return null;
            return (
              <div key={doc.key} className="sm:col-span-2">
                <KycFileUpload
                  label={doc.label}
                  hint={doc.hint}
                  required={doc.required && !needsGst}
                  disabled={!canEdit}
                  value={form[doc.key]}
                  onChange={(url) => update(doc.key, url)}
                />
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            {canEdit && (
              <>
                <button type="button" className="btn-ghost" disabled={saving} onClick={saveDraft}>
                  {saving ? "Saving..." : "Save draft"}
                </button>
                <button type="submit" className="btn-primary" disabled={submitting || kyc.completionPercent < 100}>
                  {submitting ? "Submitting..." : "Submit for verification"}
                </button>
              </>
            )}
            {app?.status === "submitted" && (
              <p className="text-body self-center text-muted">Under admin review — editing locked.</p>
            )}
          </div>
        </form>

        <aside className="rounded-xl border border-line bg-bg p-4">
          <p className="text-label">Completion</p>
          <p className="text-stat mt-1 text-teal">{kyc.completionPercent}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-teal transition-all"
              style={{ width: `${kyc.completionPercent}%` }}
            />
          </div>
          <ul className="mt-4 space-y-2">
            {checklist.map((item) => (
              <li key={item.label} className="text-small flex items-center gap-2">
                <span className={item.done ? "text-teal" : "text-muted"}>{item.done ? "✓" : "○"}</span>
                <span className={item.done ? "text-ink" : "text-muted"}>
                  {item.label}
                  {item.optional && " (optional)"}
                </span>
              </li>
            ))}
          </ul>
          {app?.submittedAt && (
            <p className="text-caption mt-4 text-muted">
              Submitted: {new Date(app.submittedAt).toLocaleString()}
            </p>
          )}
          {app?.version > 1 && (
            <p className="text-caption text-muted">Resubmission v{app.version}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
