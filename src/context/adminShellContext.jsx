"use client";

import { createContext, useContext } from "react";

const AdminShellContext = createContext({});

export function AdminShellProvider({ value, children }) {
  return <AdminShellContext.Provider value={value}>{children}</AdminShellContext.Provider>;
}

export function useAdminShell() {
  return useContext(AdminShellContext);
}
