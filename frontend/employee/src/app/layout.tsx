import './globals.css'; // keep if you have it
import Providers from './providers';
import { Noto_Sans_Thai } from 'next/font/google';
import type { Metadata } from 'next';

const notoThai = Noto_Sans_Thai({
  subsets: ['latin', 'thai'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Employee Portal',
  description: 'Employee workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoThai.className} bg-background text-foreground antialiased`}>
        {/* Client-only providers live inside this server layout */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
