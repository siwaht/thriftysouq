import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { logSessionDebug } from "@/lib/session-utils";

export function useAdminAuth() {
  const { data: authStatus, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/auth-status"],
    retry: false,
    refetchOnWindowFocus: true, // Check auth when user returns to tab
    staleTime: 0, // Always check auth status fresh
  });

  const isAuthenticated = authStatus?.isAuthenticated || false;

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if we're currently on the admin page
      if (window.location.pathname === "/admin") {
        console.log("Admin auth failed, redirecting to login");
        console.log("Auth status:", authStatus);
        logSessionDebug();
        window.location.href = "/admin-login";
      }
    }
  }, [isAuthenticated, isLoading, authStatus]);

  return {
    isAuthenticated,
    isLoading,
    error,
    refetch, // Allow manual auth check
  };
}