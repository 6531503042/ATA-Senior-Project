'use client';

import React, { Suspense } from 'react';
import Sidebar from '@/components/layout/sidebar';
import RoleGuard from '@/components/auth/RoleGuard';

// Loading component for the admin section
function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white shadow-sm z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <main className="flex-1 pl-64">
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
      <Suspense fallback={<AdminLoading />}>
        <div className="flex min-h-screen bg-gray-50">
          <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white shadow-sm z-30">
            <Sidebar />
          </aside>
          <main className="flex-1 pl-64">
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </main>
        </div>
      </Suspense>
    </RoleGuard>
  );
} 