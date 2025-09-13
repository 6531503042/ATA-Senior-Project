"use client";

import { HeroUIProvider } from "@heroui/react";
import { AlertDialogProvider } from "./components/ui/alert-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AlertDialogProvider>{children}</AlertDialogProvider>
    </HeroUIProvider>
  );
}
