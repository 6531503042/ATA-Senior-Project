import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  ChevronDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: {
    label: string;
    href: string;
  }[];
}

export function AppSidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Projects",
      icon: <FolderKanban className="w-5 h-5" />,
      children: [
        { label: "Manage", href: "/admin/projects" },
        { label: "Dashboard", href: "/admin/projects/dashboard" },
      ],
    },
    {
      label: "Questions",
      icon: <MessageSquare className="w-5 h-5" />,
      children: [
        { label: "Manage", href: "/admin/questions" },
        { label: "Dashboard", href: "/admin/questions/dashboard" },
      ],
    },
    {
      label: "Feedback",
      icon: <FileText className="w-5 h-5" />,
      children: [
        { label: "Manage", href: "/admin/feedback" },
        { label: "Dashboard", href: "/admin/feedback/dashboard" },
      ],
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen">
      {/* Logo and Brand */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">ATA</span>
          </div>
          <span className="font-semibold text-lg">Feedback</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between font-normal hover:bg-accent/50",
                      openMenus.includes(item.label) && "bg-accent"
                    )}
                    onClick={() => toggleMenu(item.label)}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openMenus.includes(item.label) && "transform rotate-180"
                      )}
                    />
                  </Button>
                  {openMenus.includes(item.label) && (
                    <div className="pl-9 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.href}
                          className={cn(
                            "block px-4 py-2 text-sm rounded-md transition-colors",
                            isActive(child.href)
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive(item.href!)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatars/user.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john.doe@ata.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}