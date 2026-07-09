import { useRef, useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { resolveMediaUrl } from "../../utils/media";
import FormField from "./FormField";

export default function FileUpload({
  label,
  hint,
  accept,
  value,
  onChange,
  preview = true,
  required,
  mediaType = "image"
}) {
  const inputRef = useRef(null);
  const { success, error: toastError } = useToast();
  const [uploading, setUploading] = useState(false);

  const previewUrl = value ? resolveMediaUrl(value) : null;
  const isVideo = mediaType === "video" || value?.match(/\.(mp4|webm)$/i);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.uploadFile(file);
      onChange?.(result.url);
      success("File uploaded successfully.");
    } catch (err) {
      toastError(err.message);
      onChange?.("");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <FormField label={label} hint={hint} required={required}>
      {preview && previewUrl && (
        <div className="mb-3">
          {isVideo ? (
            <video
              src={previewUrl}
              controls
              className="max-h-40 max-w-full rounded-lg border border-line"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Upload preview"
              className="h-24 w-24 rounded-lg border border-line object-cover"
            />
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        disabled={uploading}
        className="input-field file:mr-3 file:rounded file:border-0 file:bg-teal/10 file:px-3 file:py-1.5 file:text-small file:font-bold file:text-teal-dark"
      />
      {uploading && <p className="text-caption mt-1 text-muted">Uploading...</p>}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          className="text-caption mt-1 font-bold text-rose"
        >
          Remove file
        </button>
      )}
    </FormField>
  );
}
