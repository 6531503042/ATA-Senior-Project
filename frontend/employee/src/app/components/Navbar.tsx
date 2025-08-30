'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type NavbarProps = {
  userName?: string;
  onAvatarClick?: () => void;
};

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Status', href: '/status' },
  { label: 'Analysis', href: '/analysis' },
];

function isRouteActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  // exact or “section” match (so /status/123 is active for /status)
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ userName = 'Employee', onAvatarClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="h-16 border-b border-black/10 bg-background/80 backdrop-blur flex items-center px-6 md:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
        {/* Left: Brand + Links */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          {/* Brand */}
          <button
            onClick={() => router.push('/dashboard')}
            className="select-none text-base md:text-lg font-semibold text-default-900 hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
            aria-label="Go to dashboard"
          >
            ATA
          </button>

          {/* Divider dot (subtle) */}
          <span className="hidden md:inline-block text-default-300">•</span>

          {/* Links */}
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

        {/* Right: Greeting + Avatar */}
        <div className="flex items-center gap-3 md:gap-4 text-sm">
          <span className="hidden sm:inline text-default-600">
            Hi, <span className="font-medium text-default-900">{userName}</span>
          </span>

          <button
            onClick={onAvatarClick}
            className="cursor-pointer relative h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white grid place-items-center font-semibold shadow-sm hover:brightness-110 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open profile"
            title="Profile"
          >
            {userName?.[0]?.toUpperCase() ?? 'E'}
          </button>
        </div>
      </div>
    </nav>
  );
}
