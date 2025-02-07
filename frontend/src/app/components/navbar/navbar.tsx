"use client";

import React from "react";
import { Bell, Sun } from "lucide-react";
import Logo from "@/app/assets/ata-logo.png";
import Link from "next/link";
import { color } from "framer-motion";

const Navbar = () => {
  return (
    <div className="w-full h-max bg-white border-b border-transparent shadow-sm">
      <div className="w-full px-4 md:px-8 lg:px-12 flex justify-around items-center py-3">
        <input
          type="text"
          placeholder="Search..."
          className="px-5 text-sm py-2 w-2/3 border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-1 focus:ring-blue-100"
        />
        <div className="flex flex-row  h-full items-center justify-center text-center gap-x-3 md:gap-x-5 cursor-pointer">
          <div className="hover:bg-blue-50 p-2.5 rounded-lg transition-all">
            <Bell className="text-zinc-500 h-3 w-3 md:h-5 md:w-5" />
          </div>
          <div className="h-3 w-[1.5px] bg-zinc-300 "></div>
          <div className="hover:bg-blue-50 p-2.5 rounded-lg transition-all">
            <Sun className="text-zinc-500 h-3 w-3 md:h-5 md:w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
