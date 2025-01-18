"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";

interface SidebarAdminProps {
  onOptionSelect: (content: string) => void;
  isLoading: boolean;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  onOptionSelect,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const options = [
    { name: "Dashboard", component: "dashboard", icon: LayoutDashboard },
    { name: "User Management", component: "usermanagement", icon: Users },
    {
      name: "Feedback Management",
      component: "feedback",
      icon: MessageSquareText,
    },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0].name);

  const handleOptionClick = (option: (typeof options)[0]) => {
    if (!isLoading) {
      setSelectedOption(option.name);
      onOptionSelect(option.component);
      setIsMobileOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Always visible on mobile */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Desktop Toggle Button - Only visible when sidebar is open */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 ${
          isOpen ? "left-64" : "left-4"
        } z-50 p-2 rounded-lg bg-white shadow-lg hidden md:block transition-all duration-300`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-40
          ${isOpen ? "md:w-72" : "md:w-20"} 
          ${isMobileOpen ? "w-72" : ""}
          transition-all duration-300 md:translate-x-0
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`p-5 border-b ${isOpen ? "pt-5" : "pt-20"}`}>
            {isOpen ? (
              <img
                src="https://ata-it-th.com/wp-content/uploads/2023/03/cropped-ata_bnc.png"
                alt="ATA IT Logo"
                className={`h-12 w-auto mx-auto transition-all duration-300 
                  ${!isOpen && "md:h-8"}`}
              />
            ) : (
              <span className="text-xl font-semibold text-center cursor-pointer">
                ATA
              </span>
            )}
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 pt-4">
            <ul className="space-y-1">
              {options.map((option) => {
                const Icon = option.icon;
                const isDisabled = isLoading;
                const isSelected = selectedOption === option.name;
                return (
                  <li key={option.name}>
                    <button
                      onClick={() => handleOptionClick(option)}
                      disabled={isDisabled}
                      className={`w-full flex items-center px-4 py-3 text-xs md:text-sm transition-colors duration-150 ease-in-out whitespace-nowrap
                        ${
                          isSelected
                            ? "bg-red-50 text-red-600 border-r-4 border-red-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                        ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"} ${
                          isSelected ? "text-red-600" : "text-gray-400"
                        }`}
                      />
                      <span className={`${!isOpen && "md:hidden"}`}>
                        {option.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="border-t">
            <button
              className={`w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 ${
                !isOpen && "md:justify-center"
              }`}
              disabled={isLoading}
            >
              <Link href="/dashboard" className="flex flex-row text-nowrap">
                <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                <span className={`${!isOpen && "md:hidden"}`}>
                  Logout (Go throught Dashboard)
                </span>
              </Link>
            </button>
            <div
              className={`px-4 py-3 text-center text-xs text-gray-500 ${
                !isOpen && "md:hidden"
              }`}
            >
              © 2025 ATA Senior
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
