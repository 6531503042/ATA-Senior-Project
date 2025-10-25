/* eslint-disable @next/next/no-img-element */
'use client';

import { LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from 'next-themes';
import React from 'react';

type NavbarProps = {
  userName?: string;
  onLogout?: () => Promise<void> | void;
};

const links = [{ label: 'Feedback Hub', href: '/feedback-center' }];

function isRouteActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({
  userName = 'Employee',
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    if (onLogout) await onLogout();
    else await signOut();
  };

  useEffect(() => {
    console.log('Navbar theme:', theme);
  }, [theme]);

  return (
    <nav className="fixed top-0 w-full z-50 h-16 bg-white/80 backdrop-blur border-b border-slate-200 transition-colors">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10 h-full">
        {' '}
        {/* Left */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/feedback-center')}
            className="text-lg font-bold text-slate-800 hover:opacity-80 transition cursor-pointer"
          >
            <img
              src="/ata-logo-bg-remove.png"
              alt="ATA Logo"
              className="h-8 w-auto object-contain"
            />
          </button>

          <div className="hidden md:flex items-center gap-2">
            {links.map(link => {
              const active = isRouteActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-700 hover:bg-slate-100 ',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* User Greeting */}
          <span className="hidden sm:inline text-sm text-slate-600 ">
            Hi,{' '}
            <span className="font-medium text-slate-900 ">
              {user ? `${user.firstName} ${user.lastName}` : userName}
            </span>
          </span>

          {/* Avatar Trigger */}
          <button
            ref={triggerRef}
            onClick={() => setOpen(v => !v)}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow hover:brightness-110 transition"
          >
            {userName?.[0]?.toUpperCase() ?? 'E'}
          </button>

          {/* Dropdown */}
          <div
            ref={menuRef}
            id="user-menu"
            role="menu"
            aria-hidden={!open}
            className={[
              'absolute right-6 top-14 w-48 rounded-xl bg-white',
              'border border-slate-200 shadow-lg',
              'transition origin-top-right',
              open
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0',
            ].join(' ')}
          >
            <div className="py-1">
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
