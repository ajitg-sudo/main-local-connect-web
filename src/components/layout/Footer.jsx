"use client";

import Link from "next/link";
import { useAuth } from "../../context/authContext";
import { getDict } from "../../utils/i18n";
import { canListBusiness } from "../../utils/user";

function FooterNav({ title, links }) {
  return (
    <nav>
      <h2 className="site-footer-heading">{title}</h2>
      <div className="site-footer-links">
        {links.map((link) => (
          <Link key={link.to} href={link.to} className="site-footer-link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function Footer() {
  const { user, isOwner } = useAuth();
  const dict = getDict();
  const showListBusiness = canListBusiness(user, { isOwner });

  const companyLinks = [
    { to: "/", label: dict.footer.homeLink },
    { to: "/play-offers", label: dict.footer.playLink },
    { to: "/contact", label: dict.footer.contactLink },
    ...(showListBusiness ? [{ to: "/list-business", label: dict.footer.listBusinessLink }] : []),
    { to: "/login", label: dict.footer.signInLink },
    { to: "/communities", label: dict.footer.communitiesLink },
    { to: "/categories", label: dict.footer.categoriesLink }
  ];

  const legalLinks = [
    { to: "/terms", label: dict.footer.terms },
    { to: "/privacy", label: dict.footer.privacy },
    { to: "/disclaimer", label: dict.footer.disclaimer }
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal to-sky-500 text-small font-semibold text-white sm:h-10 sm:w-10">
                IL
              </span>
              <strong className="text-body">India Local Connect</strong>
            </div>
            <p className="text-small max-w-xs leading-relaxed text-muted sm:max-w-sm">
              Helping Indian shops, vendors, service providers, and small businesses get discovered by local customers.
            </p>
          </div>

          <FooterNav title={dict.footer.company} links={companyLinks} />
          <FooterNav title={dict.footer.legal} links={legalLinks} />

          <div className="site-footer-support">
            <h2 className="site-footer-heading">{dict.footer.support}</h2>
            <p className="text-small text-muted">support@indialocalconnect.local</p>
            <p className="text-small mt-1.5 leading-relaxed text-muted">
              WhatsApp-first listings for Indian local businesses.
            </p>
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        © {new Date().getFullYear()} India Local Connect. Built for hyperlocal trust.
      </div>
    </footer>
  );
}
