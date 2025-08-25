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
import React from 'react';

export default function EmployeeNavbar() {
  const router = useRouter();
  // TODO: replace with your real auth data
  const user = { name: 'Jane Employee', email: 'jane@company.com' };

  const handleLogout = () => {
    // TODO: hook into your auth sign-out
    console.log('Logging out…');
    router.push('/'); // or /auth/login
  };

  return (
    <Navbar maxWidth="full" className="border-b border-default-200 bg-background/70 backdrop-blur">
      <NavbarBrand className="gap-2">
        <img src="/logo-sdad.png" alt="Logo" className="h-7 w-7" />
        <span className="font-semibold tracking-wide">Employee Portal</span>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant="light" onPress={() => router.push('/employee/dashboard')}>
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
                src=""
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Menu">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-medium">Signed in as</p>
                <p className="text-default-500 text-sm truncate">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" onPress={() => router.push('/employee/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
