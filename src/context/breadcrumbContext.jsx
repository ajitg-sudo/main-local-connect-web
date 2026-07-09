"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BreadcrumbJsonLd } from "../components/seo/SiteJsonLd";
import { buildBreadcrumbs } from "../utils/breadcrumbs";

const BreadcrumbContext = createContext({
  setDynamicLabels: () => {}
});

export function BreadcrumbProvider({ children }) {
  const [dynamicLabels, setDynamicLabels] = useState({});

  return (
    <BreadcrumbContext.Provider value={{ setDynamicLabels, dynamicLabels }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbBar({ variant = "light", className = "" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dynamicLabels } = useContext(BreadcrumbContext);

  const items = useMemo(
    () => buildBreadcrumbs(pathname, searchParams, dynamicLabels),
    [pathname, searchParams, dynamicLabels]
  );

  if (!items.length) return null;

  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <div className={`breadcrumb-bar ${className}`}>
        <div className="page-container py-3">
          <Breadcrumbs items={items} variant={variant} />
        </div>
      </div>
    </>
  );
}

export function useBreadcrumbLabels(labels) {
  const { setDynamicLabels } = useContext(BreadcrumbContext);
  const serialized = JSON.stringify(labels || {});

  useEffect(() => {
    setDynamicLabels(labels || {});
    return () => setDynamicLabels({});
  }, [serialized, setDynamicLabels]);
}
