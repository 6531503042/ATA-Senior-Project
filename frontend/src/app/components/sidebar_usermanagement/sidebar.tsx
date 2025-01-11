"use client"

import React, { useState } from "react";

interface SidebarAdminProps {
  onOptionSelect: (content: string) => void;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ onOptionSelect }) => {
  const options = [
    { name: "Dashboard", component: "dashboard" },
    { name: "User Management", component: "usermanagement" },
    { name: "Facility Management", component: "facility" },
    { name: "Booking Management", component: "bookings" },
    { name: "Payment Management", component: "payments" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0].name);

  const handleOptionClick = (option: typeof options[0]) => {
    setSelectedOption(option.name);
    onOptionSelect(option.component); 
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
      <h2 className="text-lg font-bold p-4">ATA Feedback Usermangement</h2>
      <ul className="flex-1">
        {options.map((option) => (
          <li
            key={option.name}
            className={`p-4 cursor-pointer hover:bg-gray-700 ${
              selectedOption === option.name ? "bg-gray-700" : ""
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option.name}
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-gray-700 flex justify-center">
        <p className="text-sm">© 2025 ATA Senior</p>
      </div>
    </div>
  );
};

export default SidebarAdmin;
