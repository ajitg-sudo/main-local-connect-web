"use client";

import Link from "next/link";
import { userInitials } from "../../utils/user";

export default function UserAccountMenu({
  user,
  roleLabel,
  open,
  onToggle,
  menuRef,
  onClose,
  onLogout,
  dashboardPath,
  dashboardLabel,
  publicSiteLabel,
  logoutLabel,
  variant = "icon"
}) {
  const showName = variant === "pill";

  return (
    <div ref={menuRef} className={`account-menu ${open ? "account-menu-open" : ""}`}>
      <button
        type="button"
        className={`account-trigger ${showName ? "account-trigger-pill" : "account-trigger-icon"}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={onToggle}
      >
        <span className={`account-avatar ${showName ? "account-avatar-sm" : ""}`}>
          {userInitials(user?.name)}
        </span>
        {showName && (
          <>
            <span className="hidden max-w-[7rem] truncate lg:inline">{user?.name || "Account"}</span>
            <svg className="account-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="account-dropdown" role="menu">
          {user && (
            <div className="account-dropdown-user">
              <p className="account-dropdown-name">{user.name}</p>
              {roleLabel && <p className="account-dropdown-role">{roleLabel}</p>}
            </div>
          )}
          {dashboardPath && dashboardLabel && (
            <Link
              href={dashboardPath}
              className="account-dropdown-item"
              role="menuitem"
              onClick={onClose}
            >
              {dashboardLabel}
            </Link>
          )}
          {publicSiteLabel && (
            <Link href="/" className="account-dropdown-item" role="menuitem" onClick={onClose}>
              {publicSiteLabel}
            </Link>
          )}
          <button type="button" className="account-dropdown-item" role="menuitem" onClick={onLogout}>
            {logoutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
