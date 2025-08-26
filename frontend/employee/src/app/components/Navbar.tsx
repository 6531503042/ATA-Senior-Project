'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="h-16 border-b border-black/10 bg-background flex items-center px-6 gap-4">
      {/* Brand / Logo */}
      <div className="font-bold text-lg text-default-900 mr-6 cursor-pointer" onClick={() => router.push('/dashboard')}>
        Employee Portal
      </div>

      {/* Nav buttons */}
      <button
        onClick={() => router.push('/dashboard')}
        className="px-4 py-2 rounded-md text-sm font-medium hover:bg-default-100 transition cursor-pointer"
      >
        Dashboard
      </button>
      <button
        onClick={() => router.push('/status')}
        className="px-4 py-2 rounded-md text-sm font-medium hover:bg-default-100 transition cursor-pointer"
      >
        Status
      </button>
      <button
        onClick={() => router.push('/analysis')}
        className="px-4 py-2 rounded-md text-sm font-medium hover:bg-default-100 transition cursor-pointer"
      >
        Analysis
      </button>
    </nav>
  );
}
