'use client';

import React from 'react';
import Navbar from '../components/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 mx-2 md:mx-4 lg:mx-6 xl:mx-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="origin-top scale-[0.95]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
