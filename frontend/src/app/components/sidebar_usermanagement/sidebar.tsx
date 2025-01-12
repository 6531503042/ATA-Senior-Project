"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Wallet,
  LogOut
} from "lucide-react";

interface SidebarAdminProps {
  onOptionSelect: (content: string) => void;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ onOptionSelect }) => {
  const options = [
    { name: "Dashboard", component: "dashboard", icon: LayoutDashboard },
    { name: "User Management", component: "usermanagement", icon: Users },
    { name: "Facility Management", component: "facility", icon: Building2 },
    { name: "Booking Management", component: "bookings", icon: CalendarDays },
    { name: "Payment Management", component: "payments", icon: Wallet },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0].name);

  const handleOptionClick = (option: (typeof options)[0]) => {
    setSelectedOption(option.name);
    onOptionSelect(option.component);
  };

  return (
    <div className="w-72 h-screen bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <img
            src="https://ata-it-th.com/wp-content/uploads/2023/03/cropped-ata_bnc.png"
            alt="ATA IT Logo"
            className="h-12 w-auto mx-auto"
          />
        </div>
        <nav className="flex-1 pt-4">
          <ul className="space-y-1">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <li key={option.name}>
                  <button
                    onClick={() => handleOptionClick(option)}
                    className={`w-full flex items-center px-4 py-3 text-sm transition-colors duration-150 ease-in-out
                      ${
                        selectedOption === option.name
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      selectedOption === option.name
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`} />
                    {option.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t">
          <button className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150">
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
            Logout
          </button>
          <div className="px-4 py-3 text-center text-xs text-gray-500">
            © 2025 ATA Senior
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;