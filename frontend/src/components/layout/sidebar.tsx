'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  LayoutDashboard,
  FolderClosed,
  CircleHelp,
  MessageCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subMenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/admin/projects',
    icon: FolderClosed,
    subMenu: [
      { name: 'Dashboard', href: '/admin/projects' },
      { name: 'Management', href: '/admin/projects/manage' },
    ],
  },
  {
    name: 'Questions',
    href: '/admin/questions',
    icon: CircleHelp,
    subMenu: [
      { name: 'Dashboard', href: '/admin/questions' },
      { name: 'Management', href: '/admin/questions/manage' },
    ],
  },
  {
    name: 'Feedback',
    href: '/admin/feedbacks',
    icon: MessageCircle,
    subMenu: [
      { name: 'Dashboard', href: '/admin/feedbacks' },
      { name: 'Management', href: '/admin/feedbacks/manage' },
      { name: 'Submissions', href: '/admin/feedbacks/submissions' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const isActive = (href: string) => pathname === href;
  const isMenuActive = (item: MenuItem) =>
    pathname === item.href ||
    item.subMenu?.some((subItem) => pathname === subItem.href);

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">HR Admin</h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.subMenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`
                    flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg
                    ${
                      isMenuActive(item)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      openSubmenu === item.name ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                <div
                  className={`mt-1 space-y-1 ${
                    openSubmenu === item.name ? 'block' : 'hidden'
                  }`}
                >
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`
                        block pl-12 pr-4 py-2 text-sm font-medium rounded-lg
                        ${
                          isActive(subItem.href)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.href}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-lg
                  ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
} 