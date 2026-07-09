"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SOURCE_LANG = "en";
const TARGET_LANG = "hi";

function setGoogTransCookie(from, to) {
  const value = `/${from}/${to}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${value};path=/`;
  if (host && host !== "localhost") {
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  }
}

function clearGoogTransCookie() {
  document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

function prefersHindi() {
  const langs = [navigator.language, ...(navigator.languages || [])];
  return langs.some((l) => String(l).toLowerCase().startsWith("hi"));
}

function triggerHindiTranslation() {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return false;
  if (select.value !== TARGET_LANG) {
    select.value = TARGET_LANG;
    select.dispatchEvent(new Event("change"));
  }
  return true;
}

function loadGoogleTranslate(onReady) {
  if (window.google?.translate?.TranslateElement) {
    onReady();
    return undefined;
  }

  window.googleTranslateElementInit = onReady;

  if (document.getElementById("google-translate-script")) return undefined;

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);

  return undefined;
}

function initWidget() {
  if (!window.google?.translate?.TranslateElement) return;

  const container = document.getElementById("google_translate_element");
  if (!container || container.dataset.initialized === "true") return;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: SOURCE_LANG,
      includedLanguages: `${SOURCE_LANG},${TARGET_LANG}`,
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    "google_translate_element"
  );

  container.dataset.initialized = "true";
}

export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    const autoHindi = prefersHindi();

    if (autoHindi) {
      setGoogTransCookie(SOURCE_LANG, TARGET_LANG);
    } else {
      clearGoogTransCookie();
    }

    const boot = () => {
      initWidget();
      if (!autoHindi) return;

      let attempts = 0;
      const tryTranslate = () => {
        if (triggerHindiTranslation() || attempts > 30) return;
        attempts += 1;
        setTimeout(tryTranslate, 150);
      };
      setTimeout(tryTranslate, 300);
    };

    loadGoogleTranslate(boot);
  }, []);

  useEffect(() => {
    if (!prefersHindi()) return undefined;

    const timer = setTimeout(() => {
      triggerHindiTranslation();
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <div id="google_translate_element" className="google-translate-host" aria-hidden="true" />;
}
