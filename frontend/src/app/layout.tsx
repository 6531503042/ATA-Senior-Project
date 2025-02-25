'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/sidebar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {!isAuthPage && (
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white shadow-sm z-30">
              <Sidebar />
            </aside>
          )}
          <main className={`flex-1 ${!isAuthPage ? 'pl-64' : ''}`}>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
