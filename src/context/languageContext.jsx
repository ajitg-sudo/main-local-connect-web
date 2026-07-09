"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const value = useMemo(
    () => ({
      lang: "en"
    }),
    []
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
