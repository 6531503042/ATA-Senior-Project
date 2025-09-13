"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useEmployeeGuard() {
  const { role, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) router.replace("/login");
    else if (role !== "employee") router.replace("/"); // Authorizing employee
  }, [isLoading, isLoggedIn, role, router]);
}
