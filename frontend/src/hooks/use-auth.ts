import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest } from "@/lib/api/auth";
import { AxiosError } from "axios";
import { auth } from "@/lib/api/auth";

interface UseAuthReturn {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  timeUntilExpiration: number | null;
}

interface ApiErrorResponse {
  message: string;
  status: number;
  error?: string;
  details?: string[];
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(
    null,
  );

  // Function to check token status and update state
  const checkTokenStatus = useCallback(() => {
    // Skip checks if we're on a public route
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (auth.isPublicRoute(currentPath)) {
        return;
      }
    }

    if (auth.isAuthenticated()) {
      const userData = auth.getUser();
      if (userData) {
        setUser(userData);

        // Update time until expiration
        const timeLeft = auth.getTimeUntilExpiration();
        setTimeUntilExpiration(timeLeft);

        // If token is about to expire (within 2 minutes), try to refresh it
        if (auth.isTokenAboutToExpire(2)) {
          auth.refreshToken().catch(() => {
            console.warn("Failed to refresh token that was about to expire");
          });
        }
      } else {
        // If authenticated but no user data, something is wrong
        setUser(null);
        setTimeUntilExpiration(null);
      }
    } else {
      // Not authenticated (possibly expired token)
      setUser(null);
      setTimeUntilExpiration(null);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Skip initialization if we're on a public route
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (auth.isPublicRoute(currentPath)) {
            setIsLoading(false);
            return;
          }

          // Check if we just came from a redirect
          const forcedRedirect = sessionStorage.getItem("forcedRedirect");
          if (forcedRedirect === "true") {
            sessionStorage.removeItem("forcedRedirect");
            setIsLoading(false);
            return;
          }
        }

        // Check if authenticated according to auth service
        if (auth.isAuthenticated()) {
          // Get user data
          const userData = auth.getUser();

          if (userData && isMounted) {
            setUser(userData);
            setTimeUntilExpiration(auth.getTimeUntilExpiration());
          } else {
            // If no user data but supposedly authenticated, try to validate
            const isValid = await auth.validateToken();
            if (!isValid && isMounted) {
              // If token is invalid, clean up
              setUser(null);
              setTimeUntilExpiration(null);
            }
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        // Clear auth state
        setUser(null);
        setTimeUntilExpiration(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Set up token expiration check interval (every 60 seconds)
    // Using a longer interval to reduce unnecessary checks
    const tokenCheckInterval = setInterval(() => {
      if (isMounted) {
        checkTokenStatus();
      }
    }, 60000); // Check every 60 seconds

    // Set up event listener for session expired events
    const handleSessionExpired = () => {
      if (isMounted) {
        console.log("Session expired event received in useAuth hook");
        setUser(null);
        setTimeUntilExpiration(null);
        setError("Your session has expired. Please log in again.");
      }
    };

    // Listen for the custom event when token expires
    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      isMounted = false;
      clearInterval(tokenCheckInterval);
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [checkTokenStatus]);

  // Logout function
  const handleLogout = useCallback(() => {
    console.log("Logging out user");
    auth.logout();
    setUser(null);
    setTimeUntilExpiration(null);

    // Use a flag to prevent redirect loops
    localStorage.setItem("manualLogout", "true");
    window.location.href = "/auth/login";
  }, []);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await auth.login(credentials);

      if (!response) {
        throw new Error("No response received from login");
      }

      const userInfo = response.user_info;
      if (!userInfo) {
        throw new Error("User info is missing from response");
      }

      setUser(userInfo);
      setTimeUntilExpiration(auth.getTimeUntilExpiration());

      // Clear any session expired flags
      sessionStorage.removeItem("sessionExpiredHandled");

      // Redirect based on role - with a small delay to ensure state is updated
      setTimeout(() => {
        if (userInfo.roles?.includes("ROLE_ADMIN")) {
          console.log("Redirecting to admin dashboard");
          window.location.href = "/admin/dashboard";
        } else {
          console.log("Redirecting to employee dashboard");
          window.location.href = "/employee";
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse;
        console.error("API Error Response:", apiError);

        // Handle different error scenarios
        if (apiError.status === 500) {
          setError("Server error. Please try again later.");
        } else if (apiError.details?.length) {
          setError(apiError.details[0]);
        } else {
          setError(
            apiError.message || "Login failed. Please check your credentials.",
          );
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    error,
    timeUntilExpiration,
  };
}
