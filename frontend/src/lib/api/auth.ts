import api from "@/utils/api";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Set token expiration time to 1 day for testing
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Custom event for session expiration
const SESSION_EXPIRED_EVENT = "auth:session-expired";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/login"];

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  fullname: string;
  roles: string[];
}

interface TokenData {
  token: string;
  expiresAt: number;
}

export const auth = {
  async login(data: LoginRequest) {
    try {
      console.log("Attempting login with:", {
        url: "/auth/login",
        data,
      });

      const response = await api.post("/auth/login", data);

      console.log("Login response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      // Extract tokens from headers
      const accessToken = response.headers["authorization"]?.replace(
        "Bearer ",
        "",
      );
      const refreshToken = response.headers["refresh-token"];

      if (!accessToken || !refreshToken) {
        throw new Error("Authentication tokens not received");
      }

      // Calculate expiration time (current time + 10 minutes for testing)
      const expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

      // Store tokens in cookies with explicit expiration
      setCookie("accessToken", accessToken, {
        maxAge: TOKEN_EXPIRATION_TIME / 1000,
        path: "/",
        sameSite: "strict",
      });
      setCookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
        path: "/",
        sameSite: "strict",
      });

      // Store token expiration time in localStorage
      localStorage.setItem(
        "tokenExpiration",
        JSON.stringify({
          token: accessToken,
          expiresAt,
        }),
      );

      // Store user info from response body
      if (response.data?.user_info) {
        localStorage.setItem("user", JSON.stringify(response.data.user_info));

        // Store role in cookie for middleware
        if (response.data.user_info.roles?.length > 0) {
          setCookie("user_role", response.data.user_info.roles[0], {
            maxAge: TOKEN_EXPIRATION_TIME / 1000,
            path: "/",
            sameSite: "strict",
          });
        }
      }

      // Set a flag to prevent redirect loops
      localStorage.setItem("justLoggedIn", "true");

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout() {
    try {
      // Try to call logout API but don't wait for it
      api.post("/auth/logout").catch((err) => {
        console.warn("Error during logout API call:", err);
      });
    } finally {
      // Always clear all auth data regardless of API call success
      this.clearAuthData();

      // Set a flag to indicate manual logout to prevent redirect loops
      localStorage.setItem("manualLogout", "true");
    }
  },

  // Separate method to clear all auth data - for reuse
  clearAuthData() {
    // Clear cookies with proper options to ensure deletion
    deleteCookie("accessToken", { path: "/" });
    deleteCookie("refreshToken", { path: "/" });
    deleteCookie("user_role", { path: "/" });

    // Clear all localStorage items related to auth
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("justLoggedIn");
  },

  async validateToken() {
    try {
      // First check if token is expired locally
      if (!this.isTokenValid()) {
        return false;
      }

      const token = getCookie("accessToken");
      if (!token) {
        return false;
      }

      const response = await api.get("/auth/validate");
      return response.data.valid;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        return false;
      }

      const response = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            "Refresh-Token": refreshToken,
          },
        },
      );

      // Extract new access token from response
      const newAccessToken = response.headers["authorization"]?.replace(
        "Bearer ",
        "",
      );
      const newRefreshToken = response.headers["refresh-token"];

      if (!newAccessToken) {
        return false;
      }

      // Calculate new expiration time
      const expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

      // Update tokens in cookies with explicit expiration
      setCookie("accessToken", newAccessToken, {
        maxAge: TOKEN_EXPIRATION_TIME / 1000,
        path: "/",
        sameSite: "strict",
      });

      if (newRefreshToken) {
        setCookie("refreshToken", newRefreshToken, {
          maxAge: 2 * 24 * 60 * 60, // 2 days for refresh token
          path: "/",
          sameSite: "strict",
        });
      }

      // Update token expiration in localStorage
      localStorage.setItem(
        "tokenExpiration",
        JSON.stringify({
          token: newAccessToken,
          expiresAt,
        }),
      );

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  },

  async checkAuthority(requiredRole: string) {
    try {
      if (!this.isTokenValid()) {
        return false;
      }

      const response = await api.get("/auth/hasAuthority", {
        params: { requireRole: requiredRole },
      });
      return response.data.valid;
    } catch (error) {
      console.error("Authority check error:", error);
      return false;
    }
  },

  getUser(): AuthResponse | null {
    if (typeof window === "undefined") return null;

    // If token is expired, consider user as logged out
    if (!this.isTokenValid()) {
      return null;
    }

    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    // If the page just loaded after a login, consider auth valid
    if (typeof window !== "undefined" && localStorage.getItem("justLoggedIn")) {
      localStorage.removeItem("justLoggedIn");
      return true;
    }

    // Check both if token exists and is not expired
    const accessToken = getCookie("accessToken");
    if (!accessToken) return false;

    return this.isTokenValid(false); // Don't dispatch event during checks
  },

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.roles?.[0] || null;
  },

  // Token expiration handling methods
  isTokenValid(dispatchEvent = true): boolean {
    try {
      const tokenData = this.getTokenData();
      if (!tokenData) return false;

      const isValid = Date.now() < tokenData.expiresAt;
      if (!isValid && dispatchEvent) {
        this.dispatchSessionExpiredEvent();
        // Clear auth data when token is invalid
        this.clearAuthData();
      }
      return isValid;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  },

  getTokenData(): TokenData | null {
    if (typeof window === "undefined") return null;

    try {
      const tokenDataStr = localStorage.getItem("tokenExpiration");
      if (!tokenDataStr) return null;

      return JSON.parse(tokenDataStr);
    } catch (error) {
      console.error("Error parsing token data:", error);
      return null;
    }
  },

  getTimeUntilExpiration(): number | null {
    const tokenData = this.getTokenData();
    if (!tokenData) return null;

    const remainingTime = tokenData.expiresAt - Date.now();
    return remainingTime > 0 ? remainingTime : 0;
  },

  isTokenAboutToExpire(minutes = 5): boolean {
    const timeRemaining = this.getTimeUntilExpiration();
    const threshold = minutes * 60 * 1000;

    return (
      timeRemaining !== null && timeRemaining < threshold && timeRemaining > 0
    );
  },

  // Check if the current route is a public route
  isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some((route) => path.includes(route));
  },

  // Dispatch a custom event when session expires
  dispatchSessionExpiredEvent() {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      // Don't dispatch if we're on a public route
      if (this.isPublicRoute(currentPath)) {
        return false;
      }

      // Don't dispatch if we just logged out (prevents loops)
      if (localStorage.getItem("manualLogout")) {
        localStorage.removeItem("manualLogout");
        return false;
      }

      // Create and dispatch a custom event
      console.log("Dispatching session expired event");
      const event = new CustomEvent(SESSION_EXPIRED_EVENT, { bubbles: true });
      window.dispatchEvent(event);

      // Clear all auth data when session expires
      this.clearAuthData();

      // Set a flag to prevent multiple dispatches
      sessionStorage.setItem("sessionExpiredHandled", "true");

      return true;
    }
    return false;
  },

  // Force redirect to login (used as a last resort)
  forceRedirectToLogin(reason = "expired") {
    // Only redirect if we're not already on a public route
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!this.isPublicRoute(currentPath)) {
        // Clear auth data before redirecting
        this.clearAuthData();

        // Set flag to prevent loops
        sessionStorage.setItem("forcedRedirect", "true");
        window.location.href = `/auth/login?${reason}=true`;
      }
    }
  },
};
