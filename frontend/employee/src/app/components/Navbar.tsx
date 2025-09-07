'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type NavbarProps = {
  userName?: string;
  onLogout?: () => Promise<void> | void;
};

const links = [{ label: 'Dashboard', href: '/dashboard' }];

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

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // close on route change
  useEffect(() => setOpen(false), [pathname]);

  // close on click outside / Esc
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

  async function defaultLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.replace('/login');
  }

  const handleLogout = async () => {
    setOpen(false);
    if (onLogout) await onLogout();
    else await defaultLogout();
  };

  return (
    <nav className="h-16 border-b border-black/10 bg-background/80 backdrop-blur flex items-center px-6 md:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="select-none text-base md:text-lg font-semibold text-default-900 hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
            aria-label="Go to dashboard"
          >
            ATA
          </button>

          <span className="hidden md:inline-block text-default-300">•</span>

          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            {links.map(link => {
              const active = isRouteActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm font-medium transition',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-default-700 hover:bg-default-100 hover:text-default-900',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Right */}
        <div className="relative flex items-center gap-3 md:gap-4">
          <span className="hidden sm:inline text-sm text-default-600">
            Hi, <span className="font-medium text-default-900">{userName}</span>
          </span>

          {/* Trigger */}
          <button
            ref={triggerRef}
            onClick={() => setOpen(v => !v)}
            className={[
              'relative h-9 w-9 md:h-10 md:w-10 rounded-full',
              'flex items-center justify-center font-semibold',
              'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm ring-0',
              'hover:brightness-110 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            ].join(' ')}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="user-menu"
            title="Account"
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
              'absolute right-0 top-12 z-50 w-44 rounded-xl bg-white/95 backdrop-blur',
              'ring-1 ring-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
              'transition origin-top-right',
              open
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0',
            ].join(' ')}
          >
            <div className="absolute -top-2 right-4 h-3 w-3 rotate-45 bg-white/95 ring-1 ring-black/5" />

            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm rounded-xl text-red-600 hover:bg-red-50 focus:outline-none"
            >
              <LogOut className='w-4 h-4'/>
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
