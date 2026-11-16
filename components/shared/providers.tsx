"use client";

import { type ReactNode } from "react";
import { AppProvider } from "@/src/lib/store/app-provider";
import { Preloader } from "@/components/shared/preloader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Preloader />
      {children}
    </AppProvider>
  );
}
