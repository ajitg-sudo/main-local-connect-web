import { useState } from "react";

function EyeIcon() {
  return (
    <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

export default function PasswordInput({
  label,
  value,
  onChange,
  required = false,
  autoComplete = "current-password",
  placeholder,
  hint,
  className = "",
  minLength,
  id
}) {
  const [visible, setVisible] = useState(false);
  const inputId = id || `password-${label?.replace(/\s+/g, "-").toLowerCase() || "field"}`;

  return (
    <label className={`block ${className}`} htmlFor={inputId}>
      {label && (
        <span className="text-label mb-1 block">
          {label}
          {required && " *"}
        </span>
      )}
      <div className="password-input-wrap">
        <input
          id={inputId}
          className="input-field password-input"
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          minLength={minLength}
          onChange={onChange}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint && <p className="text-caption mt-1 text-muted">{hint}</p>}
    </label>
  );
}
