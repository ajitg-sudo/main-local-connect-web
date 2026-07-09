"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext(null);

const AUTO_DISMISS = {
  success: 4500,
  error: 6500,
  warning: 5500,
  info: 4500
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message: String(message), type }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS[type] || 4500);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toast: push,
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      warning: (message) => push(message, "warning"),
      info: (message) => push(message, "info")
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
