"use client";
import useSWR from "swr";

export type FormStatus = "pending" | "in_progress" | "complete";
export interface FormItem { id: string; title: string; status: FormStatus; createdAt: string; }

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useEmployeeForms() {
  const { data, error, isLoading, mutate } = useSWR<{ forms: FormItem[] }>(
    "/api/forms", // API on server / role=employee -> returning pending only
    fetcher
  );

  const forms = (data?.forms ?? []).filter(f => f.status === "pending");
  return { forms, isLoading, error, mutate };
}
