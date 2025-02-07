"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, MessageSquareText, Users, ChevronRight } from "lucide-react";
import Logo from "@/app/assets/ata-logo.png"

interface SubMenuItem {
  name: string;
  component: string;
}

interface MenuOption {
  name: string;
  component: string;
  icon: React.ElementType;
  subMenu?: SubMenuItem[];
}

interface SidebarProps {
  onComponentChange: (component: string) => void;
}

const Sidebar = ({ onComponentChange }: SidebarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const options: MenuOption[] = [
    { 
      name: "Overview", 
      component: "overview", 
      icon: LayoutDashboard
    },
    { 
      name: "Projects", 
      component: "project", 
      icon: Users,
      subMenu: [
        { name: "Dashboard", component: "project_dashboard" },
        { name: "Management", component: "project_manage" },
      ]
    },
    { 
      name: "Questions", 
      component: "question", 
      icon: MessageSquareText,
      subMenu: [
        { name: "Dashboard", component: "question_dashboard" },
        { name: "Management", component: "question_manage" },
      ]
    },
    { 
      name: "Feedback", 
      component: "feedback", 
      icon: MessageSquareText,
      subMenu: [
        { name: "Dashboard", component: "feedback_dashboard" },
        { name: "Management", component: "feedback_manage" },
      ]
    }
  ];

  const [selectedOption, setSelectedOption] = useState<string>(options[0].name);

  const handleMenuClick = (option: MenuOption): void => {
    if (option.subMenu) {
      // Toggle submenu
      if (activeSubmenu === option.name) {
        setActiveSubmenu(null);
      } else {
        setActiveSubmenu(option.name);
      }
    } else {
      // Switch component directly
      onComponentChange(option.component);
    }
    setSelectedOption(option.name);
  };

  const handleSubmenuClick = (component: string) => {
    onComponentChange(component);
  };

  return (
    <div className="w-64 h-full relative bg-white shadow-xl">
      <div className="w-full h-full flex flex-col items-center p-5 gap-10">
        {/* Logo */}
        <Link href="/dashboard_old">
          <img src={Logo.src} className="w-auto md:h-10 h-5" alt="Logo" />
        </Link>

        {/* Sidebar Menu */}
        <div className="w-full">
          <ul className="w-full flex flex-col gap-2">
            {options.map((option) => {
              const Icon = option.icon;
              const hasSubmenu = option.subMenu && option.subMenu.length > 0;
              const isActive = selectedOption === option.name;
              const isSubmenuOpen = activeSubmenu === option.name;

              return (
                <li key={option.component} className="w-full">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition text-sm ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => handleMenuClick(option)}
                  >
                    <div className="flex items-center gap-5">
                      <Icon className="w-5 h-5" />
                      <span>{option.name}</span>
                    </div>
                    {hasSubmenu && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          isSubmenuOpen ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </div>
                  
                  {/* Submenu */}
                  {hasSubmenu && option.subMenu && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isSubmenuOpen ? "max-h-48" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-12 mt-2 space-y-2">
                        {option.subMenu.map((subItem) => (
                          <li key={subItem.component}>
                            <div
                              onClick={() => handleSubmenuClick(subItem.component)}
                              className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                            >
                              {subItem.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;