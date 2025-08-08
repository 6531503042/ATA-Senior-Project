'use client';

import { useEffect, useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Href } from "@react-types/shared";

import { siteConfig } from "@/config/site";
// import { useProfile } from "@/hooks/useProfile";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
//   const user = useProfile((state) => state.user);

  const handleClick = (href: Href) => {
    router.push(href);
  };

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  }, [collapsed]);


  return (
    <>
      <aside
        className={clsx(
          "fixed lg:static h-screen border-r border-[#00000010] dark:border-[#ffffff25] flex flex-col overflow-hidden transition-all duration-200 ease-in-out z-40",
          collapsed ? "w-16" : "w-64",
          isMobileOpen ? "left-0" : "-left-full lg:left-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00000010] dark:border-[#ffffff25]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8" size="sm" src="/logo.png" />
              <span className="font-semibold text-default-900">
                {/* {user?.name.first} {user?.name.middle} {user?.name.last} */}
              </span>
            </div>
          )}
          <Button
            isIconOnly
            className="ml-auto hidden lg:flex"
            size="sm"
            variant="light"
            onPress={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {siteConfig.navMenuItems.map((section) => {
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
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Tooltip
                        key={item.href}
                        className={clsx(collapsed ? "block" : "invisible")}
                        content={collapsed ? item.label : ""}
                        placement="right"
                      >
                        <Button
                          className={clsx(
                            "relative flex items-center gap-3 p-2 rounded-md transition-all duration-200 ease-in-out w-full font-semibold",
                            collapsed ? "justify-center" : "justify-start",
                            isActive
                              ? "bg-primary-50 text-primary font-bold shadow-primary-50 shadow-lg"
                              : "hover:bg-default-100 text-default-700"
                          )}
                          isIconOnly={collapsed}
                          variant={isActive ? "shadow" : "light"}
                          onPress={() => handleClick(item.href)}
                        >
                          <span
                            className={clsx(
                              "absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-200 ease-in-out",
                              isActive ? "bg-primary" : "bg-transparent"
                            )}
                          />
                          <Icon
                            className={clsx(
                              "w-5 h-5 z-10",
                              isActive ? "text-primary" : "text-default-500"
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
            <Dropdown placement="top-start">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-default-100 p-2 rounded-md transition-colors">
                  <Avatar className="w-8 h-8" size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {/* {user?.name.first} {user?.name.middle} {user?.name.last} */}
                    </span>
                    {/* <span className="text-xs text-default-500">{user?.role.name}</span> */}
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem key="profile">Profile</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={() => {
                    router.push("/logout");
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </aside>
    </>
  );
};