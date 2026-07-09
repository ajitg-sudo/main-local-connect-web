export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-caption font-semibold ${className}`}>
      {children}
    </span>
  );
}
