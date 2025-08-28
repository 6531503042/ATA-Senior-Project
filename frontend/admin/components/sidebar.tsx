'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from '@heroui/tooltip';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Chip,
  Card,
  CardBody,
} from '@heroui/react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { Href } from '@react-types/shared';

import { siteConfig } from '@/config/site';
import { useAuthContext } from '@/contexts/AuthContext';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Proper authentication context usage
  const { user, signOut, loading: authLoading } = useAuthContext();

  const handleClick = (href: Href) => {
    router.push(href);
  };

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');

    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  return (
    <>
      <aside
        className={clsx(
          'fixed lg:static h-screen border-r border-[#00000010] dark:border-[#ffffff25] flex flex-col overflow-hidden transition-all duration-200 ease-in-out z-40',
          collapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'left-0' : '-left-full lg:left-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00000010] dark:border-[#ffffff25]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-default-900">
                Admin Panel
              </span>
            </div>
          )}
          <Button
            isIconOnly
            className="ml-auto hidden lg:flex"
            size="sm"
            variant="light"
            onPress={() => setCollapsed(prev => !prev)}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {siteConfig.navMenuItems.map(section => {
            return (
              <div key={section.section} className="space-y-1">
                {!collapsed && (
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                      {section.section}
                    </p>
                  </div>
                )}
                <div className="space-y-1 px-2">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Tooltip
                        key={item.href}
                        className={clsx(collapsed ? 'block' : 'invisible')}
                        content={collapsed ? item.label : ''}
                        placement="right"
                      >
                        <Button
                          className={clsx(
                            'relative flex items-center gap-3 p-2 rounded-md transition-all duration-200 ease-in-out w-full font-semibold',
                            collapsed ? 'justify-center' : 'justify-start',
                            isActive
                              ? 'bg-primary-50 text-primary font-bold shadow-primary-50 shadow-lg'
                              : 'hover:bg-default-100 text-default-700',
                          )}
                          isIconOnly={collapsed}
                          variant={isActive ? 'shadow' : 'light'}
                          onPress={() => handleClick(item.href)}
                        >
                          <span
                            className={clsx(
                              'absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-200 ease-in-out',
                              isActive ? 'bg-primary' : 'bg-transparent',
                            )}
                          />
                          <Icon
                            className={clsx(
                              'w-5 h-5 z-10',
                              isActive ? 'text-primary' : 'text-default-500',
                            )}
                          />
                          {!collapsed && (
                            <span className="text-sm z-10">{item.label}</span>
                          )}
                        </Button>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-[#00000010] dark:border-[#ffffff25] p-4">
            <Card className="bg-white/50 dark:bg-default-50/50 border-none shadow-sm">
              <CardBody className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="w-9 h-9"
                    name={user?.firstName || user?.username}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">
                      {user
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                          user.username
                        : 'Guest'}
                    </p>
                    <p className="text-xs text-default-500 truncate">
                      {user?.email}
                    </p>
                    {user?.roles?.length ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user.roles
                          .slice(0, 2)
                          .map((role: string, idx: number) => (
                            <Chip
                              key={idx}
                              className="text-[10px]"
                              color="primary"
                              size="sm"
                              variant="flat"
                            >
                              {role}
                            </Chip>
                          ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Chip
                    color={user?.active ? 'success' : 'danger'}
                    size="sm"
                    variant="flat"
                  >
                    {user?.active ? 'Active' : 'Inactive'}
                  </Chip>
                  <Dropdown placement="top-end">
                    <DropdownTrigger>
                      <Button size="sm" variant="light">
                        Actions
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User menu">
                      <DropdownItem
                        key="profile"
                        onPress={() => router.push('/profile')}
                      >
                        Profile
                      </DropdownItem>
                      <DropdownItem
                        key="settings"
                        onPress={() => router.push('/settings')}
                      >
                        Settings
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        onPress={signOut}
                      >
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </aside>
    </>
  );
};
