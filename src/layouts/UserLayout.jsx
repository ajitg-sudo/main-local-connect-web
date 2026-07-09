"use client";

import { Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SkipLink from "../components/layout/SkipLink";
import { BreadcrumbBar, BreadcrumbProvider } from "../context/breadcrumbContext";

function SiteChrome({ children }) {
  return (
    <BreadcrumbProvider>
      <SkipLink />
      <Header />
      <main id="main-content" className="site-header-offset flex-1" tabIndex={-1}>
        <BreadcrumbBar />
        {children}
      </main>
      <Footer />
    </BreadcrumbProvider>
  );
}

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <>
            <SkipLink />
            <Header />
            <main id="main-content" className="site-header-offset flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </>
        }
      >
        <SiteChrome>{children}</SiteChrome>
      </Suspense>
    </div>
  );
}
