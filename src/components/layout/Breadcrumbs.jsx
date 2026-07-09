"use client";

import Link from "next/link";

function Chevron() {
  return (
    <svg className="breadcrumb-sep h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Breadcrumbs({ items = [], variant = "light", className = "" }) {
  if (!items.length) return null;

  return (
    <nav className={`breadcrumb breadcrumb-${variant} ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="breadcrumb-item">
              {index > 0 && <Chevron />}
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
