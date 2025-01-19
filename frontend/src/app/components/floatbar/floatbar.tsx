"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

const FloatBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <div className="flex flex-row rounded-full p-3 gap-3 bg-white items-center">
        <button
          className="bg-blue-500 text-white p-2 rounded-full"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <Menu className="text-sm" /> : <Menu className="text-sm" />}
        </button>

        {isMenuOpen && (
          <div className=" bg-white rounded-full">
            <ul className="flex flex-row gap-3 cursor-pointer">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatBar;
