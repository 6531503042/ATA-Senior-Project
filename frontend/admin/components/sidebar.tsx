'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from '@heroui/tooltip';
import { ChevronLeftIcon, ChevronRightIcon, LogOut, User, Settings, Bell } from 'lucide-react';
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
          'fixed lg:static h-screen border-r border-default-200/50 dark:border-default-100/20 flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-40 bg-white/95 dark:bg-default-50/95 backdrop-blur-sm',
          collapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'left-0' : '-left-full lg:left-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default-200/50 dark:border-default-100/20 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-default-100 dark:to-default-50">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-default-900 text-lg">
                  Admin Panel
                </span>
                <p className="text-xs text-default-500">Management Dashboard</p>
              </div>
            </div>
          )}
          <Button
            isIconOnly
            className="ml-auto hidden lg:flex hover:bg-default-100 transition-colors"
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
                            'relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ease-in-out w-full font-medium group',
                            collapsed ? 'justify-center' : 'justify-start',
                            isActive
                              ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary font-semibold shadow-lg shadow-primary-100/50'
                              : 'hover:bg-default-100 text-default-700 hover:shadow-md',
                          )}
                          isIconOnly={collapsed}
                          variant={isActive ? 'shadow' : 'light'}
                          onPress={() => handleClick(item.href)}
                        >
                          <span
                            className={clsx(
                              'absolute left-0 top-0 h-full w-1.5 rounded-r-full transition-all duration-300 ease-in-out',
                              isActive ? 'bg-gradient-to-b from-primary to-secondary' : 'bg-transparent',
                            )}
                          />
                          <Icon
                            className={clsx(
                              'w-5 h-5 z-10 transition-all duration-300',
                              isActive ? 'text-primary' : 'text-default-500 group-hover:text-primary',
                            )}
                          />
                          {!collapsed && (
                            <span className="text-sm z-10 transition-all duration-300">{item.label}</span>
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
          <div className="border-t border-default-200/50 dark:border-default-100/20 p-4 bg-gradient-to-t from-default-50/50 to-transparent">
            <Card className="bg-white/80 dark:bg-default-50/80 border border-default-200/50 shadow-lg backdrop-blur-sm">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar
                      className="w-10 h-10 ring-2 ring-primary/20"
                      name={user?.firstName || user?.username}
                      size="sm"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-default-900">
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
                              className="text-[10px] font-medium"
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
                <div className="flex items-center justify-between">
                  <Chip
                    color={user?.active ? 'success' : 'danger'}
                    size="sm"
                    variant="flat"
                    className="font-medium"
                  >
                    {user?.active ? 'Active' : 'Inactive'}
                  </Chip>
                  <Dropdown placement="top-end">
                    <DropdownTrigger>
                      <Button 
                        size="sm" 
                        variant="light"
                        className="hover:bg-default-100 transition-colors"
                      >
                        Actions
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User menu">
                      <DropdownItem
                        key="profile"
                        startContent={<User className="w-4 h-4" />}
                        onPress={() => router.push('/profile')}
                      >
                        Profile
                      </DropdownItem>
                      <DropdownItem
                        key="settings"
                        startContent={<Settings className="w-4 h-4" />}
                        onPress={() => router.push('/settings')}
                      >
                        Settings
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<LogOut className="w-4 h-4" />}
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
