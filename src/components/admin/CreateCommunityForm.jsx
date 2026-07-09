import { useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { COMMUNITY_CATEGORIES, MAJOR_CITIES } from "../../utils/constants";
import FormField from "../common/FormField";

const initialForm = {
  name: "",
  city: "Pune",
  category: COMMUNITY_CATEGORIES[0],
  admin: "",
  description: "",
  status: "Active"
};

export default function CreateCommunityForm({ onCreated }) {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.adminCreateCommunity(form);
      setForm(initialForm);
      success("Community created successfully.");
      onCreated?.();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-subtitle">Create community</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Community name" required>
          <input
            className="input-field"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Pune Electricians Network"
          />
        </FormField>
        <FormField label="City" required>
          <select className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)}>
            {MAJOR_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Category">
          <select className="input-field" value={form.category} onChange={(e) => update("category", e.target.value)}>
            {COMMUNITY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Community admin name">
          <input
            className="input-field"
            value={form.admin}
            onChange={(e) => update("admin", e.target.value)}
            placeholder="Lead organizer"
          />
        </FormField>
      </div>
      <FormField label="Description">
        <textarea
          className="input-field min-h-[100px]"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What this group is for and who should join..."
        />
      </FormField>
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Creating..." : "Create community"}
      </button>
    </form>
  );
}
