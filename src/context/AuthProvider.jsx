// @refresh reset
"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ilc_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem("ilc_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem("ilc_token", res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.register(payload);
    localStorage.setItem("ilc_token", res.token);
    setUser(res.user);
    return res;
  }, []);

  const registerCustomer = useCallback(async (payload) => {
    const res = await api.registerCustomer(payload);
    localStorage.setItem("ilc_token", res.token);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ilc_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await api.updateProfile(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const loginWithSession = useCallback((token, sessionUser) => {
    localStorage.setItem("ilc_token", token);
    setUser(sessionUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      registerCustomer,
      logout,
      updateProfile,
      loginWithSession,
      isAdmin: user?.role === "super_admin" || user?.role === "city_admin",
      isOwner: user?.role === "business_owner",
      isCustomer: user?.role === "customer"
    }),
    [user, loading, login, register, registerCustomer, logout, updateProfile, loginWithSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
