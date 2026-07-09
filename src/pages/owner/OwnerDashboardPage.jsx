"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import FormField from "../../components/common/FormField";
import CategorySelect from "../../components/common/CategorySelect";
import FileUpload from "../../components/common/FileUpload";
import BusinessHoursPicker from "../../components/common/BusinessHoursPicker";
import { IMAGE_ACCEPT } from "../../utils/media";
import KycSubmissionPanel from "../../components/owner/KycSubmissionPanel";
import PlanUpgradePanel from "../../components/owner/PlanUpgradePanel";
import PlanUsageBanner from "../../components/owner/PlanUsageBanner";
import OwnerAnalyticsPanel from "../../components/owner/OwnerAnalyticsPanel";
import BusinessGalleryEditor from "../../components/owner/BusinessGalleryEditor";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { DISCOVER_INTERLINKS } from "../../utils/interlinks";
import { isAtOfferingLimit } from "../../utils/planLimits";

const TEXT_FIELDS = ["name", "phone", "city", "area"];

export default function OwnerDashboardPage() {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const [workspace, setWorkspace] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [form, setForm] = useState({});
  const [offeringForm, setOfferingForm] = useState({
    title: "",
    type: "Service",
    price: "",
    discount: "",
    couponCode: "",
    validUntil: "",
    description: ""
  });
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", city: "" });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loadError, setLoadError] = useState("");

  const load = () =>
    api.ownerWorkspace()
      .then(setWorkspace)
      .catch((err) => {
        setLoadError(err.message);
        toastError(err.message);
      });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || ""
      });
    }
  }, [user]);

  useEffect(() => {
    if (workspace?.businesses?.length && !selectedBusiness) {
      setSelectedBusiness(workspace.businesses[0]);
      setForm(workspace.businesses[0]);
    }
  }, [workspace, selectedBusiness]);

  const saveBusiness = async (e) => {
    e.preventDefault();
    try {
      await api.updateBusiness(selectedBusiness.id, form);
      success("Business profile updated.");
      await load();
    } catch (err) {
      toastError(err.message);
    }
  };

  const addOffering = async (e) => {
    e.preventDefault();
    try {
      await api.createOffering({ ...offeringForm, business: selectedBusiness.name, businessId: selectedBusiness.id });
      setOfferingForm({ title: "", type: "Service", price: "", discount: "", couponCode: "", validUntil: "", description: "" });
      success("Offering added.");
      await load();
    } catch (err) {
      toastError(err.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      success("Account profile updated.");
    } catch (err) {
      toastError(err.message);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toastError("New passwords do not match.");
      return;
    }
    try {
      await api.changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      });
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      success("Password updated successfully.");
    } catch (err) {
      toastError(err.message);
    }
  };

  if (!workspace && !loadError) {
    return <div className="text-body flex min-h-[50vh] items-center justify-center px-4 text-muted">Loading workspace...</div>;
  }

  if (loadError) {
    return (
      <section className="page-container py-16 text-center">
        <p className="text-body text-rose">{loadError}</p>
        <Link href="/login" className="btn-primary btn-inline mt-4">Sign in again</Link>
      </section>
    );
  }

  const hasBusinesses = workspace.businesses.length > 0;
  const businessOfferings = workspace.offerings.filter(
    (o) => o.businessId === selectedBusiness?.id || o.business === selectedBusiness?.name
  );
  const offeringLimitReached = selectedBusiness
    ? isAtOfferingLimit(selectedBusiness.premium, businessOfferings.length)
    : false;

  return (
    <section className="page-section">
      <p className="eyebrow">Owner workspace</p>
      <h1 className="heading-page">Welcome, {user?.name}</h1>
      <p className="text-body mt-2 text-muted">
        Customer ID: <strong className="break-all text-ink">{user?.id}</strong> — use email or phone to login next time.
      </p>

      <KycSubmissionPanel />

      {hasBusinesses && selectedBusiness && (
        <div className="mt-6 space-y-6">
          <PlanUsageBanner business={selectedBusiness} offeringCount={businessOfferings.length} />
          <PlanUpgradePanel
            business={selectedBusiness}
            onUpgraded={load}
          />
          <OwnerAnalyticsPanel business={selectedBusiness} />
        </div>
      )}

      <form onSubmit={saveProfile} className="card mt-8 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-subtitle">Account profile</h2>
          <p className="text-body mt-1 text-muted">Update your login details and contact information.</p>
        </div>
        <FormField label="Full name" required>
          <input
            className="input-field"
            required
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
          />
        </FormField>
        <FormField label="Email" required>
          <input
            className="input-field"
            type="email"
            required
            value={profileForm.email}
            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
          />
        </FormField>
        <FormField label="Phone" required>
          <input
            className="input-field"
            type="tel"
            required
            value={profileForm.phone}
            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </FormField>
        <FormField label="City">
          <input
            className="input-field"
            value={profileForm.city}
            onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))}
          />
        </FormField>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">Save profile</button>
        </div>
      </form>

      {!hasBusinesses ? (
        <div className="card mt-8 text-center">
          <h2 className="text-subtitle">No business listed yet</h2>
          <p className="text-body mt-2 text-muted">
            Your account is ready. Submit your business details to get listed on India Local Connect.
          </p>
          <Link href="/list-business" className="btn-primary btn-inline mt-6">
            List your business
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <form onSubmit={saveBusiness} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-subtitle">Business profile</h2>
              {selectedBusiness?.status && (
                <span className="text-caption rounded-full bg-line px-2.5 py-1 font-bold text-muted">
                  Listing: {selectedBusiness.status}
                  {selectedBusiness.verified && " · Verified"}
                </span>
              )}
            </div>
            <select
              className="input-field"
              value={selectedBusiness?.id || ""}
              onChange={(e) => {
                const biz = workspace.businesses.find((b) => b.id === e.target.value);
                setSelectedBusiness(biz);
                setForm(biz || {});
              }}
            >
              {workspace.businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {TEXT_FIELDS.map((field) => (
              <FormField key={field} label={field}>
                <input
                  className="input-field"
                  value={form[field] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                />
              </FormField>
            ))}
            <FormField label="Category">
              <CategorySelect
                value={form.category || ""}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              />
            </FormField>
            <BusinessHoursPicker
              value={form.hours || ""}
              onChange={(hours) => setForm((p) => ({ ...p, hours }))}
            />
            <FileUpload
              label="Business logo / photo"
              hint="JPEG, PNG, or WebP. Max 5 MB. Counts toward your plan photo limit."
              accept={IMAGE_ACCEPT}
              value={form.logoUrl || ""}
              onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
            />
            <BusinessGalleryEditor
              business={selectedBusiness}
              logoUrl={form.logoUrl}
              galleryUrls={form.galleryUrls || []}
              onChange={(galleryUrls) => setForm((p) => ({ ...p, galleryUrls }))}
            />
            <FormField label="Description">
              <textarea
                className="input-field min-h-[100px]"
                value={form.description || ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </FormField>
            <FormField label="Google Maps link">
              <input
                className="input-field"
                type="url"
                placeholder="https://maps.google.com/..."
                value={form.mapUrl || ""}
                onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))}
              />
            </FormField>
            <button className="btn-primary">Save changes</button>
          </form>

          <div className="space-y-6">
            <form onSubmit={addOffering} className="card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-subtitle">Add offering</h2>
                <span className="text-caption text-muted">
                  {businessOfferings.length}
                  {selectedBusiness?.planUsage?.limits?.maxOfferings != null
                    ? ` / ${selectedBusiness.planUsage.limits.maxOfferings}`
                    : ""}{" "}
                  offerings
                </span>
              </div>
              {offeringLimitReached && (
                <p className="text-small rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  Offering limit reached on your {selectedBusiness.premium} plan. Upgrade to add more.
                </p>
              )}
              <FormField label="Title" required>
                <input className="input-field" required value={offeringForm.title} onChange={(e) => setOfferingForm((p) => ({ ...p, title: e.target.value }))} />
              </FormField>
              <FormField label="Type">
                <select className="input-field" value={offeringForm.type} onChange={(e) => setOfferingForm((p) => ({ ...p, type: e.target.value }))}>
                  <option>Service</option>
                  <option>Product</option>
                  <option>Deal</option>
                </select>
              </FormField>
              <FormField label="Price">
                <input className="input-field" placeholder="Rs. 500" value={offeringForm.price} onChange={(e) => setOfferingForm((p) => ({ ...p, price: e.target.value }))} />
              </FormField>
              <FormField label="Discount">
                <input className="input-field" placeholder="10% off" value={offeringForm.discount} onChange={(e) => setOfferingForm((p) => ({ ...p, discount: e.target.value }))} />
              </FormField>
              <FormField label="Coupon code" hint="Used when customers play games for your listing">
                <input className="input-field" placeholder="SALON10" value={offeringForm.couponCode} onChange={(e) => setOfferingForm((p) => ({ ...p, couponCode: e.target.value }))} />
              </FormField>
              <FormField label="Valid until">
                <input className="input-field" type="date" value={offeringForm.validUntil} onChange={(e) => setOfferingForm((p) => ({ ...p, validUntil: e.target.value }))} />
              </FormField>
              <FormField label="Description">
                <textarea className="input-field min-h-[100px]" value={offeringForm.description} onChange={(e) => setOfferingForm((p) => ({ ...p, description: e.target.value }))} />
              </FormField>
              <button className="btn-primary" disabled={offeringLimitReached}>
                Add offering
              </button>
            </form>

            <div className="card">
              <h2 className="text-subtitle">Your offerings</h2>
              <div className="mt-4 space-y-3">
                {businessOfferings.map((o) => (
                  <div key={o.id} className="rounded-lg border border-line p-3">
                    <p className="text-body font-bold">{o.title}</p>
                    <p className="text-small text-muted">
                      {o.business} · {o.type} · {o.price}
                      {o.discount && ` · ${o.discount}`}
                      {o.couponCode && ` · Code: ${o.couponCode}`}
                    </p>
                    {o.description && <p className="text-small mt-1 text-muted">{o.description}</p>}
                  </div>
                ))}
                {!businessOfferings.length && <p className="text-body text-muted">No offerings yet.</p>}
              </div>
            </div>

            <form onSubmit={changePassword} className="card space-y-3">
              <h2 className="text-subtitle">Change password</h2>
              <FormField label="Current password" required>
                <input className="input-field" type="password" required value={pwdForm.currentPassword} onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))} />
              </FormField>
              <FormField label="New password" required>
                <input className="input-field" type="password" required minLength={6} value={pwdForm.newPassword} onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))} />
              </FormField>
              <FormField label="Confirm new password" required>
                <input className="input-field" type="password" required value={pwdForm.confirmPassword} onChange={(e) => setPwdForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </FormField>
              <button className="btn-primary">Update password</button>
            </form>
          </div>
        </div>
      )}
      <PageInterlinks
        links={[
          { href: "/", label: "Public directory" },
          { href: "/list-business", label: "Add another listing" },
          { href: "/communities", label: "Communities" },
          { href: "/contact", label: "Contact support" }
        ]}
        className="mt-8"
      />
    </section>
  );
}
