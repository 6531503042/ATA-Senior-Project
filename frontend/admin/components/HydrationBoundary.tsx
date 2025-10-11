'use client';

import { useEffect, useState } from 'react';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationBoundary({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Immediate hydration
    setIsHydrated(true);
  }, []);

  // Always render children, but conditionally show loading
  return (
    <>
      {!isHydrated && fallback}
      <div style={{ display: isHydrated ? 'block' : 'none' }}>
        {children}
      </div>
    </>
  );
}
