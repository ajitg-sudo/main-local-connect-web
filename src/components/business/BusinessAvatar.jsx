import { resolveMediaUrl } from "../../utils/media";

export default function BusinessAvatar({
  business,
  variant = "default",
  className = "h-14 w-14 sm:h-16 sm:w-16"
}) {
  const logoUrl = resolveMediaUrl(business.logoUrl);
  const initials = (business.initials || business.name?.slice(0, 2) || "IL").toUpperCase();

  if (variant === "circle" || variant === "card") {
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={`${business.name} logo`}
          className={`business-card-logo ${className}`}
        />
      );
    }
    return (
      <div className={`business-card-logo business-card-logo-fallback ${className}`}>
        {initials}
      </div>
    );
  }

  if (variant === "sidebar") {
    if (logoUrl) {
      return (
        <img
          src={logoUrl}
          alt={`${business.name} logo`}
          className="business-card-sidebar-logo"
        />
      );
    }
    return <span className="business-card-sidebar-initials">{initials}</span>;
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${business.name} logo`}
        className={`shrink-0 rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`text-subtitle grid shrink-0 place-items-center rounded-xl bg-teal/10 text-teal-dark ${className}`}>
      {initials}
    </div>
  );
}
