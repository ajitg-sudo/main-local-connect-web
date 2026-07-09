"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { setRedirectPath } from "../utils/navigation";

export default function ProtectedRoute({ children, roles, loginPath = "/login" }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setRedirectPath(pathname);
      router.replace(loginPath);
      return;
    }

    if (roles?.length && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, loading, roles, loginPath, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  if (!user || (roles?.length && !roles.includes(user.role))) {
    return null;
  }

  return children;
}
