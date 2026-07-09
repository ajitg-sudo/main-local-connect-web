"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { canListBusiness } from "../../utils/user";
import { BUSINESS_TYPES, isPaidPlan } from "../../utils/constants";
import { openRazorpayCheckout } from "../../utils/razorpay";
import PageBanner from "../../components/layout/PageBanner";
import FormField from "../../components/common/FormField";
import CategorySelect from "../../components/common/CategorySelect";
import FileUpload from "../../components/common/FileUpload";
import BusinessHoursPicker from "../../components/common/BusinessHoursPicker";
import PlanSelector from "../../components/owner/PlanSelector";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { DISCOVER_INTERLINKS } from "../../utils/interlinks";
import { defaultSchedule, isValidHours, scheduleToString } from "../../utils/businessHours";
import { IMAGE_ACCEPT } from "../../utils/media";

const initialForm = {
  businessName: "",
  ownerName: "",
  category: BUSINESS_TYPES[0],
  city: "Pune",
  area: "",
  phone: "",
  email: "",
  password: "",
  hours: scheduleToString(defaultSchedule()),
  description: "",
  mapUrl: "",
  logoUrl: "",
  plan: "Free"
};

export default function ListBusinessPage() {
  const router = useRouter();
  const { user, isOwner, loginWithSession } = useAuth();
  const { success, error: toastError, warning, info } = useToast();
  const [listingForm, setListingForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const denied = user && !canListBusiness(user, { isOwner });

  useEffect(() => {
    if (isOwner && user) {
      setListingForm((prev) => ({
        ...prev,
        ownerName: user.name || prev.ownerName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        city: user.city || prev.city
      }));
    }
  }, [isOwner, user]);

  const update = (field, value) => setListingForm((p) => ({ ...p, [field]: value }));

  const resetForm = () =>
    setListingForm({
      ...initialForm,
      ownerName: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      city: user?.city || "Pune"
    });

  const processPayment = async (pendingPlan, businessId, sessionUser) => {
    const order = await api.createPaymentOrder({ businessId, plan: pendingPlan });
    const payment = await openRazorpayCheckout({ order, user: sessionUser });
    await api.verifyPayment(payment);
    return pendingPlan;
  };

  const submitListing = async (e) => {
    e.preventDefault();
    if (!isValidHours(listingForm.hours)) {
      toastError("Please select at least one open day and set business hours.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...listingForm };
      if (user) {
        delete payload.email;
        delete payload.password;
      }
      const result = await api.createListing(payload);

      let sessionUser = user;
      if (result.token && result.user) {
        loginWithSession(result.token, result.user);
        sessionUser = result.user;
      }

      if (result.pendingPlan && isPaidPlan(result.pendingPlan)) {
        info("Listing saved. Complete payment to activate your plan...");
        const paidPlan = await processPayment(
          result.pendingPlan,
          result.business.id,
          sessionUser
        );
        success(
          `${paidPlan} plan activated! Listing submitted for review. Complete KYC in your owner dashboard — listings go live after KYC approval.`
        );
      } else {
        success(
          "Listing submitted for review. Complete KYC in your owner dashboard — listings go live after KYC approval."
        );
      }
      resetForm();
    } catch (err) {
      if (err.message === "Payment cancelled") {
        warning(
          "Listing saved on Free plan. You can upgrade anytime from your owner dashboard."
        );
        resetForm();
      } else {
        toastError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const paidSelected = isPaidPlan(listingForm.plan);
  const submitLabel = paidSelected
    ? submitting
      ? "Processing..."
      : `Submit & pay for ${listingForm.plan}`
    : submitting
      ? "Submitting..."
      : "Submit listing";

  useEffect(() => {
    if (denied) router.replace("/");
  }, [denied, router]);

  if (denied) {
    return null;
  }

  return (
    <div>
      <PageBanner
        eyebrow="Owner onboarding"
        title="List your business"
        subtitle="Simple form for low-end Android phones: name, category, area, WhatsApp, timings, and plan. Get discovered by local customers."
      />

      <section className="page-section">
        {!user && (
          <div className="card mb-6 flex flex-col gap-3 border-teal/30 bg-teal/5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body text-muted">
              <strong className="text-ink">Tip:</strong> Create a free owner account first — then your listings link to your dashboard automatically.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Link href="/register" className="btn-primary btn-inline">Sign up</Link>
              <Link href="/login" className="btn-ghost btn-inline">Sign in</Link>
            </div>
          </div>
        )}
        {isOwner && (
          <div className="card mb-6 border-emerald-200 bg-emerald-50 text-body">
            Logged in as <strong>{user.name}</strong> ({user.id}). Listing will be added to your dashboard.
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <form onSubmit={submitListing} className="card grid gap-4">
            <h2 className="text-subtitle">Business details</h2>

            <FormField label="Business name" required>
              <input className="input-field" required value={listingForm.businessName} onChange={(e) => update("businessName", e.target.value)} />
            </FormField>
            <FormField label="Owner name" required>
              <input className="input-field" required value={listingForm.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </FormField>
            <FormField label="Area / locality" required>
              <input className="input-field" required placeholder="e.g. Kothrud, Andheri West" value={listingForm.area} onChange={(e) => update("area", e.target.value)} />
            </FormField>
            <FormField label="Phone / WhatsApp" required>
              <input className="input-field" required type="tel" value={listingForm.phone} onChange={(e) => update("phone", e.target.value)} />
            </FormField>
            <FormField label="City" required>
              <input className="input-field" required value={listingForm.city} onChange={(e) => update("city", e.target.value)} />
            </FormField>
            <FormField label="Category" required>
              <CategorySelect
                required
                value={listingForm.category}
                onChange={(e) => update("category", e.target.value)}
              />
            </FormField>
            <BusinessHoursPicker
              required
              value={listingForm.hours}
              onChange={(hours) => update("hours", hours)}
            />
            <FileUpload
              label="Business logo / photo"
              hint="JPEG, PNG, or WebP. Max 5 MB. Shown on your listing card."
              accept={IMAGE_ACCEPT}
              value={listingForm.logoUrl}
              onChange={(url) => update("logoUrl", url)}
            />
            <FormField label="Description">
              <textarea
                className="input-field min-h-[100px]"
                placeholder="What services do you offer? Any specialties?"
                value={listingForm.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </FormField>
            <FormField label="Google Maps link" hint="Paste your Google Maps location URL">
              <input className="input-field" type="url" placeholder="https://maps.google.com/..." value={listingForm.mapUrl} onChange={(e) => update("mapUrl", e.target.value)} />
            </FormField>

            <div className="lg:hidden">
              <p className="text-body mb-2 font-bold text-ink">Plan</p>
              <PlanSelector compact value={listingForm.plan} onChange={(plan) => update("plan", plan)} />
            </div>

            {!user && (
              <>
                <FormField label="Owner email" hint="Used to create your owner account">
                  <input className="input-field" type="email" value={listingForm.email} onChange={(e) => update("email", e.target.value)} />
                </FormField>
                <FormField label="Account password" hint="Min 6 characters — login with email or phone later">
                  <input className="input-field" type="password" minLength={6} value={listingForm.password} onChange={(e) => update("password", e.target.value)} />
                </FormField>
              </>
            )}

            {paidSelected && (
              <p className="text-body rounded-lg border border-teal/30 bg-teal/5 px-3 py-2 text-muted">
                You will be redirected to Razorpay secure checkout after submitting your listing.
              </p>
            )}

            <button className="btn-primary" disabled={submitting}>
              {submitLabel}
            </button>
            <p className="text-body text-muted">
              Already listed? <Link href="/login" className="font-bold text-teal">Sign in to manage</Link>
            </p>
          </form>

          <div className="hidden lg:block">
            <PlanSelector value={listingForm.plan} onChange={(plan) => update("plan", plan)} />
          </div>
        </div>
      </section>
      <section className="page-section pt-0">
        <PageInterlinks
          links={DISCOVER_INTERLINKS.filter((l) => l.href !== "/list-business")}
          title="While you list"
        />
      </section>
    </div>
  );
}
