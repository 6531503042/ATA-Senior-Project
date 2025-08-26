'use client';

import { useRouter, usePathname } from 'next/navigation';

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Status', href: '/status' },
  { label: 'Analysis', href: '/analysis' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="h-16 border-b border-black/10 bg-background flex items-center px-6 gap-4">
      {/* Brand */}
      <div
        className="font-bold text-lg text-default-900 mr-6 cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        Employee Portal
      </div>

      {/* Buttons */}
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-default-700 hover:bg-default-100 hover:text-default-900'
              }
            `}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}
