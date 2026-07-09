"use client";

import { Suspense } from "react";
import OwnerHeader from "../components/owner/OwnerHeader";
import SkipLink from "../components/layout/SkipLink";
import { BreadcrumbBar, BreadcrumbProvider } from "../context/breadcrumbContext";

export default function OwnerLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Suspense
        fallback={
          <>
            <SkipLink />
            <OwnerHeader />
            <main id="main-content" className="site-header-offset flex-1" tabIndex={-1}>
              {children}
            </main>
          </>
        }
      >
        <BreadcrumbProvider>
          <SkipLink />
          <OwnerHeader />
          <main id="main-content" className="site-header-offset flex-1" tabIndex={-1}>
            <BreadcrumbBar />
            {children}
          </main>
        </BreadcrumbProvider>
      </Suspense>
    </div>
  );
}
