"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/hooks/useAuth";
import type { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Protected routes that require authentication
  const protectedRoutes = ["/", "/dashboard", "/users", "/projects", "/questions", "/feedbacks", "/departments", "/roles"];
  const authRoutes = ["/login", "/logout"];

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = auth.isLoggedIn();
      const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

      if (!isLoggedIn && isProtectedRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push("/login");
      } else if (isLoggedIn && isAuthRoute && pathname !== "/logout") {
        // Redirect to dashboard if authenticated and trying to access auth routes
        router.push("/");
      }
    };

    checkAuth();
  }, [auth, router, pathname]);

  // Auto-refresh token when needed
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.isLoggedIn()) {
        await auth.ensureValidSession();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [auth]);

  const contextValue: AuthContextType = {
    user: auth.user,
    loading: auth.loading,
    signIn: async (username: string, password: string) => {
      const success = await auth.signIn(username, password);
      if (success) {
        router.push("/");
      }
    },
    signOut: async () => {
      await auth.signOut();
      router.push("/login");
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

