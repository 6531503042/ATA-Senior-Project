'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from '@heroui/tooltip';
import { ChevronLeftIcon, ChevronRightIcon, LogOut } from 'lucide-react';
import {
  Button,
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

        {/* Footer - New Account Card Design */}
        {!collapsed && (
          <div className="border-t border-default-200/50 dark:border-default-100/20 p-3 bg-gradient-to-t from-primary-50/30 to-transparent">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-primary-50/20 border border-primary-200/30 shadow-xl backdrop-blur-sm">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"></div>
              
              <div className="relative p-4">
                {/* User Info Section */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {(user?.firstName || user?.username || 'G').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-default-900 truncate">
                      {user
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                          user.username
                        : 'Guest User'}
                    </h3>
                    <p className="text-xs text-default-500 truncate mb-1">
                      {user?.email}
                    </p>
                    
                    {/* Role Badge */}
                    {user?.roles?.length ? (
                      <div className="flex gap-1">
                        {user.roles.slice(0, 1).map((role: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-100 text-primary-800 border border-primary-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user?.active ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-medium text-default-600">
                      {user?.active ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="solid"
                    color="danger"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-3"
                    startContent={<LogOut className="w-3.5 h-3.5" />}
                    onPress={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
              
              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
