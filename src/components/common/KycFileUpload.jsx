import { useRef, useState } from "react";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import { KYC_ACCEPT, resolveMediaUrl } from "../../utils/media";
import FormField from "./FormField";

export default function KycFileUpload({ label, hint, value, onChange, required, disabled }) {
  const inputRef = useRef(null);
  const { success, error: toastError } = useToast();
  const [uploading, setUploading] = useState(false);

  const previewUrl = value ? resolveMediaUrl(value) : null;
  const isPdf = value?.toLowerCase().includes(".pdf");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.uploadKycFile(file);
      onChange?.(result.url);
      success("Document uploaded successfully.");
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
      {previewUrl && (
        <div className="mb-3">
          {isPdf ? (
            <a href={previewUrl} target="_blank" rel="noreferrer" className="text-body font-bold text-teal">
              View uploaded PDF
            </a>
          ) : (
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="max-h-32 rounded-lg border border-line object-cover"
            />
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={KYC_ACCEPT}
        onChange={handleFile}
        disabled={uploading || disabled}
        className="input-field file:mr-3 file:rounded file:border-0 file:bg-teal/10 file:px-3 file:py-1.5 file:text-small file:font-bold file:text-teal-dark"
      />
      {uploading && <p className="text-caption mt-1 text-muted">Uploading securely...</p>}
      {value && !uploading && (
        <button type="button" onClick={() => onChange?.("")} className="text-caption mt-1 font-bold text-rose">
          Remove file
        </button>
      )}
    </FormField>
  );
}
