import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { checkAuthStatus } from "@/lib/auth-api";

export function useAdminAuth() {
  const { data: authStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-auth-status'],
    queryFn: checkAuthStatus,
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: true, // Check auth when user returns to tab
    staleTime: 0, // Always check auth status fresh
    refetchInterval: 30000, // Check every 30 seconds to maintain session
  });

  const isAuthenticated = authStatus?.isAuthenticated || false;

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if we're currently on the admin page
      if (window.location.pathname === "/admin") {
        console.log("Admin auth failed, redirecting to login");
        console.log("Auth status:", authStatus);
        console.log("Current cookies:", document.cookie);
        // Use replace to prevent back navigation issues
        window.location.replace("/admin-login");
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