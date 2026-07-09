export default function FormField({ label, children, required, className = "", hint }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="text-label mb-1 block">
          {label}
          {required && " *"}
        </span>
      )}
      {children}
      {hint && <p className="text-caption mt-1 text-muted">{hint}</p>}
    </label>
  );
}
