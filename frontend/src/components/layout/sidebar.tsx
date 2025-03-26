"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FolderKanban,
  CircleHelp,
  MessageSquare,
  LogOut,
  ClipboardList,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@assets/ata-logo.png";
import Image from "next/image";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Manage projects",
  },
  {
    name: "Questions",
    href: "/admin/questions",
    icon: CircleHelp,
    description: "Feedback questions",
  },
  {
    name: "Feedback",
    href: "/admin/feedbacks",
    icon: MessageSquare,
    description: "View feedbacks",
  },
  {
    name: "Submissions",
    href: "/admin/submissions",
    icon: ClipboardList,
    description: "View submissions",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage users and departments",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 transition-transform hover:scale-[0.98]"
        >
          <Image
                src={Logo}
                alt="ATA Logo" 
                width={200}
                height={200}
                priority
                unoptimized
              />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "hover:bg-violet-50 group relative",
              isActive(item.href)
                ? "bg-violet-100 text-violet-900 shadow-sm"
                : "text-gray-600"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-violet-200"
                  : "bg-gray-100 group-hover:bg-violet-100"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive(item.href)
                    ? "text-violet-600"
                    : "text-gray-600 group-hover:text-violet-600"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-gray-500">{item.description}</span>
            </div>
            {isActive(item.href) && (
              <div className="absolute left-0 w-1 h-8 bg-violet-600 rounded-r-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100">
            <LogOut className="w-5 h-5 group-hover:text-red-600" />
          </div>
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
