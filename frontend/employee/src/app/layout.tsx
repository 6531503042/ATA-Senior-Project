import type { Metadata } from 'next';
import {Providers} from './providers';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Employee Portal',
  description: 'Employee workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
