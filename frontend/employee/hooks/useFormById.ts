"use client";
import useSWR from "swr";
import type { FormItem } from "./useEmployeeForms";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useFormById(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ form: FormItem }>(
    id ? `/api/forms/${id}` : null,
    fetcher
  );
  return { form: data?.form, isLoading, error, mutate };
}
