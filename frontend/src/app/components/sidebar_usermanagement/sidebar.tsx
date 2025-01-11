"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";

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

  const handleOptionClick = (option: (typeof options)[0]) => {
    setSelectedOption(option.name);
    onOptionSelect(option.component);
  };

  const StyledLogo = styled.img`
`;

  return (
    <div className="w-64 h-screen p-5  text-black">
      <div className="flex flex-col h-full justify-between border-2 bg-white border-red-600 rounded-md">
        <div className="flex flex-col">
        <StyledLogo
        src="https://ata-it-th.com/wp-content/uploads/2023/03/cropped-ata_bnc.png"
        alt="ATA IT Logo"
        className="h-full w-full p-4"
      />
          <ul className="flex-1">
            {options.map((option) => (
              <li
                key={option.name}
                className={`m-4 p-4 cursor-pointer border text-sm rounded-md ${
                  selectedOption === option.name
                    ? "border-red-400 text-red-500 bg-red-50"
                    : "border-transparent hover:border-red-400"
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-gray-700 flex justify-center">
          <p className="text-sm">© 2025 ATA Senior</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
