"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { useAnimatedPresence } from "../../hooks/useAnimatedPresence";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import { getDict } from "../../utils/i18n";

export default function OwnerHeader() {
  const { user, logout, isAdmin } = useAuth();
  const dict = getDict();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerHidden = useHeaderScroll();
  const { mounted: menuMounted, visible: menuVisible } = useAnimatedPresence(menuOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHeaderEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <header
        className={`site-header ${headerEntered ? "site-header-entered" : ""} ${headerHidden ? "site-header-scrolled-away" : ""}`}
      >
        <div className="page-container h-full">
          <div className="site-header-bar">
            <Link href="/owner" className="flex min-w-0 shrink-0 items-center gap-2.5">
              <span className="text-body grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal to-sky-500 font-semibold text-white sm:h-10 sm:w-10">
                IL
              </span>
              <span className="min-w-0">
                <strong className="text-body block truncate font-semibold leading-tight">
                  {dict.owner.console}
                </strong>
                <small className="text-caption hidden text-muted sm:block">India Local Connect</small>
              </span>
            </Link>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
              {user && (
                <span className="text-small hidden max-w-[140px] truncate text-muted md:inline lg:max-w-[200px]">
                  {user.name}
                </span>
              )}
              <Link href="/" className="header-auth-link">
                {dict.auth.publicSite}
              </Link>
              {isAdmin && (
                <Link href="/admin" className="header-auth-link">
                  {dict.auth.adminDashboard}
                </Link>
              )}
              <button type="button" onClick={handleLogout} className="header-auth-link">
                {dict.auth.logout}
              </button>
              <button
                type="button"
                className="header-menu-btn sm:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={`header-menu-icon ${menuOpen ? "header-menu-icon-open" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuMounted && (
        <>
          <button
            type="button"
            className={`site-header-overlay ${menuVisible ? "is-visible" : "is-hidden"}`}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className={`site-header-drawer ${menuVisible ? "is-visible" : "is-hidden"}`}>
            <nav className="page-container flex flex-col gap-1 py-3 sm:hidden" aria-label="Owner menu">
              {user && (
                <p className="text-small mb-1 px-3 font-medium text-muted">{user.name}</p>
              )}
              <Link href="/" className="header-mobile-link">
                {dict.auth.publicSite}
              </Link>
              {isAdmin && (
                <Link href="/admin" className="header-mobile-link">
                  {dict.auth.adminDashboard}
                </Link>
              )}
              <button type="button" onClick={handleLogout} className="header-mobile-link w-full text-left">
                {dict.auth.logout}
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
