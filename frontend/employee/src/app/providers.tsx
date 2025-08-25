'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <HeroUIProvider navigate={router.push}>
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
