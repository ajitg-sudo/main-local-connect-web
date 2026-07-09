"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "../common/NavLink";
import { useAuth } from "../../context/authContext";
import { useAnimatedPresence } from "../../hooks/useAnimatedPresence";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import { getDict } from "../../utils/i18n";
import { formatPublicUserRole, userInitials, canListBusiness } from "../../utils/user";
import UserAccountMenu from "../common/UserAccountMenu";

const NAV_ITEMS = [
  { to: "/", key: "home", end: true },
  { to: "/categories", key: "categories" },
  { to: "/list-business", key: "listBusiness" },
  { to: "/communities", key: "communities" },
  { to: "/play-offers", key: "playOffers" },
  { to: "/contact", key: "contact" }
];

const desktopNavClass = ({ isActive }) =>
  `header-nav-link ${isActive ? "header-nav-link-active" : ""}`;

const mobileNavClass = ({ isActive }) =>
  `header-mobile-link ${isActive ? "header-mobile-link-active" : ""}`;

export default function Header() {
  const { user, loading, logout, isAdmin, isOwner, isCustomer } = useAuth();
  const dict = getDict();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerHidden = useHeaderScroll();
  const accountRef = useRef(null);
  const { mounted: menuMounted, visible: menuVisible } = useAnimatedPresence(menuOpen);
  const pathname = usePathname();
  const router = useRouter();

  const dashboardPath = isAdmin ? "/admin" : isOwner ? "/owner" : null;
  const dashboardLabel = isAdmin ? dict.auth.adminDashboard : dict.auth.ownerDashboard;
  const roleLabel = user ? formatPublicUserRole({ isAdmin, isOwner, isCustomer }) : "";
  const showListBusiness = canListBusiness(user, { isOwner });
  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.key !== "listBusiness" || showListBusiness),
    [showListBusiness]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHeaderEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return undefined;

    const handlePointer = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

  const handleLogout = () => {
    setAccountOpen(false);
    logout();
    router.push("/");
  };

  return (
    <>
      <header
        className={`site-header ${headerEntered ? "site-header-entered" : ""} ${headerHidden ? "site-header-scrolled-away" : ""}`}
      >
        <div className="page-container h-full">
          <div className="site-header-bar">
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
              <span className="text-body grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal to-sky-500 font-semibold text-white sm:h-10 sm:w-10">
                IL
              </span>
              <span className="min-w-0">
                <strong className="text-body block truncate font-semibold leading-tight">India Local Connect</strong>
                <small className="text-caption hidden text-muted md:block">Local trust, one tap away</small>
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} href={item.to} end={item.end} className={desktopNavClass}>
                  {dict.nav[item.key]}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              {loading ? (
                <span className="h-9 w-9 animate-pulse rounded-full bg-line sm:h-10 sm:w-10" />
              ) : user ? (
                <div className="hidden sm:block">
                  <UserAccountMenu
                      user={user}
                      roleLabel={roleLabel}
                      open={accountOpen}
                      onToggle={() => setAccountOpen((open) => !open)}
                      menuRef={accountRef}
                      onClose={() => setAccountOpen(false)}
                      onLogout={handleLogout}
                      dashboardPath={dashboardPath}
                      dashboardLabel={dashboardLabel}
                      logoutLabel={dict.auth.logout}
                    variant="icon"
                  />
                </div>
              ) : (
                <>
                  <Link href="/login" className="header-auth-link">
                    {dict.auth.signIn}
                  </Link>
                  <Link href="/signup" className="btn-primary btn-inline inline-flex px-3 sm:px-4">
                    {dict.auth.signUp}
                  </Link>
                </>
              )}

              <button
                type="button"
                className="header-menu-btn md:hidden"
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
            <nav className="page-container flex flex-col gap-1 py-3" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} href={item.to} end={item.end} className={mobileNavClass}>
                  {dict.nav[item.key]}
                </NavLink>
              ))}

              <div className="mt-2 border-t border-line pt-3">
                {user ? (
                  <>
                    <div className="account-mobile-card">
                      <span className="account-avatar account-avatar-sm">{userInitials(user.name)}</span>
                      <div className="min-w-0">
                        <p className="text-small truncate font-semibold text-ink">{user.name}</p>
                        <p className="text-caption text-muted">{roleLabel}</p>
                      </div>
                    </div>
                    {dashboardPath && (
                      <Link href={dashboardPath} className="header-mobile-link">
                        {dashboardLabel}
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} className="header-mobile-link w-full text-left">
                      {dict.auth.logout}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="header-mobile-link">
                    {dict.auth.signIn}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
