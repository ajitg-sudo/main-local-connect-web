"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  to,
  end = false,
  className,
  children,
  isActive: isActiveOverride,
  ...rest
}) {
  const pathname = usePathname();
  const destination = href ?? to ?? "/";
  const pathnameOnly = destination.split("?")[0];

  let isActive;
  if (typeof isActiveOverride === "function") {
    isActive = isActiveOverride();
  } else if (typeof isActiveOverride === "boolean") {
    isActive = isActiveOverride;
  } else if (end) {
    isActive = pathname === pathnameOnly;
  } else {
    isActive =
      pathname === pathnameOnly ||
      (pathnameOnly !== "/" && pathname.startsWith(`${pathnameOnly}/`));
  }

  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={destination} className={resolvedClassName} {...rest}>
      {children}
    </Link>
  );
}
