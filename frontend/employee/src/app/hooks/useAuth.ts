"use client";
import useSWR from "swr";

export type UserRole = "employee" | "admin" | "manager";
export interface SessionUser { id: string; name?: string; role: UserRole; }

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useAuth() {
  const { data, error, isLoading } = useSWR<{ user: SessionUser }>("/api/me", fetcher);
  return {
    user: data?.user,
    role: data?.user?.role as UserRole | undefined,
    isLoading,
    error,
    isLoggedIn: !!data?.user,
  };
}
