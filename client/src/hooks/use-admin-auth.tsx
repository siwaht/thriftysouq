import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAdminAuth() {
  const { data: authStatus, isLoading, error } = useQuery({
    queryKey: ["/api/admin/auth-status"],
    retry: false,
  });

  const isAuthenticated = authStatus?.isAuthenticated || false;

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if we're currently on the admin page
      if (window.location.pathname === "/admin") {
        window.location.href = "/admin-login";
      }
    }
  }, [isAuthenticated, isLoading]);

  return {
    isAuthenticated,
    isLoading,
    error,
  };
}