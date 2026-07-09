"use client";

import { AuthProvider } from "@/context/authContext";
import { LanguageProvider } from "@/context/languageContext";
import { ToastProvider } from "@/context/toastContext";
import GoogleTranslate from "@/components/common/GoogleTranslate";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <GoogleTranslate />
        <ToastProvider>{children}</ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
