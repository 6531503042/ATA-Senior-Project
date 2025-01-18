"use client"

import React from "react";
import { Eclipse } from "lucide-react";
import Logo from "@/app/assets/ata-logo.png";
import Link from "next/link";

const navbar = () => {
  return (
    <div className="w-full p-3 border-b flex justify-center">
      <div className="inline-flex flex-row justify-between items-center w-3/4 ">
        <h1 className="font-bold text-2xl cursor-pointer animate-[animation-r6madp_10s_infinite] bg-gradient-to-r from-red-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
          Feedback System
        </h1>

        <p className="flex flex-row items-center space-x-10 cursor-pointer">
          <Link href="/dashboard_admin"> <img src={Logo.src} className="w-auto h-10" /></Link>
          <Eclipse className="text-zinc-800" />
        </p>
      </div>
    </div>
  );
};

export default navbar;
