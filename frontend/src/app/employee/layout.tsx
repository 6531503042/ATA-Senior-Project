'use client';

import EmployeeLayout from '@/components/layout/EmployeeLayout';
import RoleGuard from '@/components/auth/RoleGuard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ROLE_USER']}>
      <EmployeeLayout>{children}</EmployeeLayout>
    </RoleGuard>
  );
} 