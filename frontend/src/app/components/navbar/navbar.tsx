"use client";

import React from "react";
import { Eclipse } from "lucide-react";
import Logo from "@/app/assets/ata-logo.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full fixed top-0 bg-white z-50 border-b">
      <div className="max-w-[1945px] mx-auto w-full px-4 md:px-8 lg:px-12 flex justify-between items-center py-3">
        {/* Title */}
        <h1 className="font-bold text-nowrap md:text-2xl text-lg cursor-pointer bg-gradient-to-r from-red-400 via-teal-400 to-green-400 bg-clip-text text-transparent animate-[animation-r6madp_10s_infinite]">
          Feedback System
        </h1>

        {/* Logo & Icon */}
        <div className="flex items-center gap-x-6 md:gap-x-12 cursor-pointer">
          <Link href="/dashboard_admin">
            <img src={Logo.src} className="w-auto md:h-10 h-5" />
          </Link>
          <Eclipse className="text-zinc-800 h-3 w-3 md:h-5 md:w-5" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
