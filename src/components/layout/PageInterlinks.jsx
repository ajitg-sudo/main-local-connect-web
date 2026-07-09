"use client";

import Link from "next/link";

export default function PageInterlinks({ title = "Related pages", links = [], className = "" }) {
  if (!links.length) return null;

  return (
    <nav className={`page-interlinks ${className}`} aria-label={title}>
      <p className="page-interlinks-title">{title}</p>
      <div className="page-interlinks-list">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="page-interlink">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
