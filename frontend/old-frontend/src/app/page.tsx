"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAlertDialog } from "@/components/ui/alert-dialog";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { showAlert } = useAlertDialog();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.roles.includes("ROLE_ADMIN")) {
          router.push("/admin/dashboard");
        } else if (user.roles.includes("ROLE_USER")) {
          router.push("/employee");
        } else {
          // If no valid role, show alert and redirect to login
          showAlert({
            title: "Access Denied",
            description:
              "You don't have the required permissions to access the system.",
            variant: "solid",
            color: "danger",
          });
          router.push("/auth/login");
        }
      } else {
        // Not authenticated, show alert and redirect to login
        showAlert({
          title: "Authentication Required",
          description: "Please log in to access the system.",
          variant: "solid",
          color: "warning",
        });
        router.push("/auth/login");
      }
    }
  }, [isLoading, isAuthenticated, user, router, showAlert]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Transition state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg inline-block mb-6">
          <h1 className="text-3xl font-bold text-white">ATA Bank</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to HR Management System
        </h2>
        <p className="text-gray-600">Redirecting you to your dashboard...</p>
        <div className="animate-pulse mt-4">
          <div className="h-2 w-24 bg-violet-200 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
