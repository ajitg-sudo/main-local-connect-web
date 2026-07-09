"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { clearContactState, getContactState } from "../../utils/navigation";
import PageBanner from "../../components/layout/PageBanner";
import FormField from "../../components/common/FormField";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { DISCOVER_INTERLINKS, SUPPORT_INTERLINKS } from "../../utils/interlinks";

const SUBJECTS = [
  "Listing support",
  "Advertisement packages",
  "City partnership",
  "Report listing",
  "General inquiry"
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: SUBJECTS[0],
  message: ""
};

function buildInitialForm() {
  const contactState = getContactState();
  clearContactState();
  const reportBusiness = contactState?.business;
  return {
    ...initialForm,
    subject: contactState?.subject || initialForm.subject,
    message: reportBusiness
      ? `I would like to report the listing: ${reportBusiness}`
      : initialForm.message
  };
}

export default function ContactPage() {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState(buildInitialForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitContact(form);
      success(res.message || "Message sent successfully.");
      setForm(initialForm);
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner
        eyebrow="Support"
        title="Contact us"
        subtitle="Questions about listings, ads, partnerships, or reporting — our team will respond by email."
      />

      <section className="page-section">
        <div className="card mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Your name" required>
              <input
                className="input-field"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </FormField>
            <FormField label="Email" required>
              <input
                className="input-field"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </FormField>
            <FormField label="Phone">
              <input
                className="input-field"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </FormField>
            <FormField label="Subject">
              <select
                className="input-field"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Message" required>
              <textarea
                className="input-field min-h-[120px]"
                required
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </FormField>
            <button className="btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </section>
      <section className="page-container pb-10">
        <PageInterlinks title="Explore the directory" links={DISCOVER_INTERLINKS} />
        <PageInterlinks title="Policies" links={SUPPORT_INTERLINKS} className="mt-6" />
      </section>
    </div>
  );
}
