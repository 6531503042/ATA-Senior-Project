"use client";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";
import type { FormItem } from "./useEmployeeForms";

async function completeReq(url: string) {
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error("Complete failed");
  return res.json();
}

export function useCompleteForm() {
  // use with endpoint: POST /api/forms/:id/complete
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/forms/complete-trigger", // key [Mocking] mutation
    (_key: string, { arg: id }: { arg: string }) => completeReq(`/api/forms/${id}/complete`)
  );

  async function complete(id: string) {
    // optimistic: Remove from cache ของ /api/forms 
    await globalMutate("/api/forms", (prev: { forms: FormItem[] } | undefined) => {
      if (!prev) return prev;
      return { forms: prev.forms.filter(f => f.id !== id) };
    }, false);

    try {
      await trigger(id);
      // sync with server again
      await globalMutate("/api/forms");
    } catch (e) {
      // rollback
      await globalMutate("/api/forms");
      throw e;
    }
  }

  return { complete, isMutating, error };
}
