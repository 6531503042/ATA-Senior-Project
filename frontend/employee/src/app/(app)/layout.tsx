'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

function EmployeeTopbar() {
  const router = useRouter();
  // TODO: replace with real session user
  const user = { name: 'Employee', email: 'employee@example.com' };

  const onLogout = useCallback(() => {
    // TODO: hook into your auth sign-out flow
    router.push('/'); // or /auth/login
  }, [router]);

  return (
    <Navbar maxWidth="full" className="border-b border-default-200 bg-background/70 backdrop-blur">
      <NavbarBrand className="gap-2">
        <img src="/logo-sdad.png" alt="Logo" className="h-7 w-7" />
        <span className="font-semibold tracking-wide">Employee</span>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant="light" onPress={() => router.push('/dashboard')}>
            Dashboard
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                isBordered
                className="transition-transform"
                name={user.name}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Menu">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-medium">Signed in as</p>
                <p className="text-default-500 text-sm truncate">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" onPress={() => router.push('/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={onLogout}>
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EmployeeTopbar />
        <main className="flex-1 overflow-y-auto p-6 mx-2 md:mx-4 lg:mx-6 xl:mx-8">
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
