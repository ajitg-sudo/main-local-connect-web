import { useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import {
  AD_POSITIONS,
  MAJOR_CITIES,
  getAdFormatsForPosition,
  getAdSpec,
  getDefaultAdSize
} from "../../utils/constants";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import AdBanner from "../ads/AdBanner";

const initialForm = {
  title: "",
  position: AD_POSITIONS[0].value,
  size: getDefaultAdSize(AD_POSITIONS[0].value),
  city: "India",
  expiry: "",
  price: "",
  media: "Image",
  mediaUrl: "",
  targetUrl: ""
};

export default function CreateAdForm({ onCreated }) {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const formats = getAdFormatsForPosition(form.position, form.media);
  const sizeSpec = getAdSpec(form.position, form.size, form.media);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "position") {
        next.size = getDefaultAdSize(value, next.media);
      }
      if (field === "media") {
        next.size = getDefaultAdSize(next.position, value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        expiry: form.expiry || undefined,
        price: form.price || undefined,
        mediaUrl: form.mediaUrl || undefined,
        targetUrl: form.targetUrl || undefined
      };
      await api.adminCreateAd(payload);
      setForm(initialForm);
      success("Ad created and is now live.");
      onCreated?.();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <h2 className="text-subtitle">Create new ad</h2>
        <p className="text-body mt-1 text-muted">
          Choose a standard ad size. Upload creative at {sizeSpec.w}×{sizeSpec.h}px
          {sizeSpec.note ? ` — ${sizeSpec.note}` : ""}.
        </p>
      </div>

      <FormField label="Ad title" required>
        <input
          className="input-field"
          required
          placeholder="Monsoon AC Service Offer"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </FormField>

      <FormField label="Position" required>
        <select className="input-field" value={form.position} onChange={(e) => update("position", e.target.value)}>
          {AD_POSITIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Ad format"
        hint={`${sizeSpec.label} — ${sizeSpec.w}×${sizeSpec.h}px (${sizeSpec.group})`}
      >
        <select className="input-field" value={form.size} onChange={(e) => update("size", e.target.value)}>
          {formats.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Target city" required hint="Use India for nationwide ads">
        <select className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)}>
          <option value="India">India (all cities)</option>
          {MAJOR_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Expiry date">
        <input className="input-field" type="date" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} />
      </FormField>

      <FormField label="Package price">
        <input className="input-field" placeholder="Rs. 5000/month" value={form.price} onChange={(e) => update("price", e.target.value)} />
      </FormField>

      <FormField label="Media type" hint="Animated GIFs use image sizes">
        <select className="input-field" value={form.media} onChange={(e) => update("media", e.target.value)}>
          <option>Image</option>
          <option>Video</option>
        </select>
      </FormField>

      <FileUpload
        label="Upload creative"
        hint={`Best: ${sizeSpec.w}×${sizeSpec.h}px ${form.media === "Video" ? "video" : "image"}. Max 5 MB.`}
        accept={form.media === "Video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"}
        value={form.mediaUrl}
        onChange={(url) => update("mediaUrl", url)}
        mediaType={form.media === "Video" ? "video" : "image"}
      />

      <FormField label="Or paste media URL" hint="Optional — use if you already host the file elsewhere">
        <input
          className="input-field"
          // When a creative is uploaded via multer, `mediaUrl` becomes `/uploads/...png` (relative path).
          // `type="url"` would fail built-in browser validation for relative URLs, so use plain text.
          type="text"
          placeholder="https://images.unsplash.com/..."
          value={form.mediaUrl}
          onChange={(e) => update("mediaUrl", e.target.value)}
        />
      </FormField>

      <FormField label="Click-through URL" hint="Where users go when they click the ad">
        <input
          className="input-field"
          type="url"
          placeholder="https://example.com/offer"
          value={form.targetUrl}
          onChange={(e) => update("targetUrl", e.target.value)}
        />
      </FormField>

      {(form.mediaUrl || form.title) && (
        <div className="lg:col-span-2">
          <p className="text-label mb-2">Live preview — {sizeSpec.label}</p>
          <AdBanner
            ad={{
              id: "preview",
              title: form.title || "Ad preview",
              position: form.position,
              size: form.size,
              media: form.media,
              mediaUrl: form.mediaUrl,
              targetUrl: form.targetUrl
            }}
            placement={form.position}
          />
        </div>
      )}

      <div className="lg:col-span-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Publishing..." : "Publish ad"}
        </button>
      </div>
    </form>
  );
}
