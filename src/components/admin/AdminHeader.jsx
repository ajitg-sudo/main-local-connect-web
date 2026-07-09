"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NavLink from "../common/NavLink";
import { useAuth } from "../../context/authContext";
import { useAnimatedPresence } from "../../hooks/useAnimatedPresence";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import { ADMIN_TABS, DEFAULT_ADMIN_TAB, adminTabPath, formatAdminRole } from "../../utils/adminNav";
import { getDict } from "../../utils/i18n";
import { userInitials } from "../../utils/user";
import UserAccountMenu from "../common/UserAccountMenu";

const mobileNavClass = ({ isActive }) =>
  `header-mobile-link ${isActive ? "header-mobile-link-active" : ""}`;

export default function AdminHeader({ pendingJoins = 0, pendingKyc = 0, pendingPayments = 0 }) {
  const { user, logout } = useAuth();
  const dict = getDict();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerHidden = useHeaderScroll();
  const accountRef = useRef(null);
  const { mounted: menuMounted, visible: menuVisible } = useAnimatedPresence(menuOpen);

  const activeTab = searchParams.get("tab") || DEFAULT_ADMIN_TAB;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHeaderEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname, searchParams.toString()]);

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
    router.push("/admin/login");
  };

  const tabBadge = (key) => {
    if (key === "communities" && pendingJoins > 0) return pendingJoins;
    if (key === "kyc" && pendingKyc > 0) return pendingKyc;
    if (key === "payments" && pendingPayments > 0) return pendingPayments;
    return null;
  };

  const renderTab = (item, className, labelKey = "label") => {
    const badge = tabBadge(item.key);
    const label = dict.admin.tabs[item.key] || item[labelKey];

    return (
      <NavLink
        key={item.key}
        href={adminTabPath(item.key)}
        className={className}
        isActive={() => activeTab === item.key}
      >
        {label}
        {badge ? <span className="admin-nav-badge">{badge}</span> : null}
      </NavLink>
    );
  };

  const tabClass = ({ isActive }) => `admin-tab ${isActive ? "admin-tab-active" : ""}`;

  return (
    <>
      <header
        className={`admin-header site-header ${headerEntered ? "site-header-entered" : ""} ${headerHidden ? "site-header-scrolled-away" : ""}`}
      >
        <div className="page-container">
          <div className="admin-topbar">
            <Link href="/admin" className="flex min-w-0 shrink-0 items-center gap-2.5">
              <span className="text-body grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal to-sky-500 font-semibold text-white sm:h-10 sm:w-10">
                IL
              </span>
              <span className="min-w-0">
                <strong className="text-body block truncate font-semibold leading-tight">
                  {dict.admin.console}
                </strong>
                <small className="text-caption hidden text-muted sm:block">India Local Connect</small>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden md:block">
                <UserAccountMenu
                  user={user}
                  roleLabel={user ? formatAdminRole(user.role) : ""}
                  open={accountOpen}
                  onToggle={() => setAccountOpen((open) => !open)}
                  menuRef={accountRef}
                  onClose={() => setAccountOpen(false)}
                  onLogout={handleLogout}
                  publicSiteLabel={dict.auth.publicSite}
                  logoutLabel={dict.auth.logout}
                  variant="pill"
                />
              </div>

              <button
                type="button"
                className="header-menu-btn md:hidden"
                aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className={`header-menu-icon ${menuOpen ? "header-menu-icon-open" : ""}`} />
              </button>
            </div>
          </div>

          <nav className="admin-tabs" aria-label="Admin sections">
            {ADMIN_TABS.map((item) => renderTab(item, tabClass))}
          </nav>
        </div>
      </header>

      {menuMounted && (
        <>
          <button
            type="button"
            className={`site-header-overlay admin-header-overlay ${menuVisible ? "is-visible" : "is-hidden"}`}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className={`site-header-drawer admin-header-drawer ${menuVisible ? "is-visible" : "is-hidden"}`}>
            <nav className="page-container flex flex-col gap-1 py-3 md:hidden" aria-label="Admin mobile navigation">
              {user && (
                <div className="account-mobile-card mx-0">
                  <span className="account-avatar account-avatar-sm">{userInitials(user.name)}</span>
                  <div className="min-w-0">
                    <p className="text-small truncate font-semibold text-ink">{user.name}</p>
                    <p className="text-caption text-muted">{formatAdminRole(user.role)}</p>
                  </div>
                </div>
              )}

              {ADMIN_TABS.map((item) => renderTab(item, mobileNavClass))}

              <div className="mt-2 border-t border-line pt-3">
                <Link href="/" className="header-mobile-link">
                  {dict.auth.publicSite}
                </Link>
                <button type="button" onClick={handleLogout} className="header-mobile-link w-full text-left">
                  {dict.auth.logout}
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
