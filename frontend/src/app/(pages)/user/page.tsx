"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeadingScreen from "@/components/loadingscreen/loadingscreen_admin";
import authMiddleware from "../../../../middleware/authMiddleware";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false); // To prevent infinite loop
  const router = useRouter();

  useEffect(() => {
    if (checked) return; // Prevent effect from running multiple times

    const checkAuth = async () => {
      const token = localStorage.getItem("access_token"); // Use 'token' key for consistency
      const userInfo = localStorage.getItem("user");
    
      if (!token || !userInfo) {
        router.push("/signin");
        return;
      }
    
      const parsedUserInfo = JSON.parse(userInfo);
      const userRole = parsedUserInfo.roles ? parsedUserInfo.roles[0] : null;
    
      if (userRole === "ROLE_ADMIN") {
        router.push("/admin");
      } else if (userRole === "ROLE_USER") {
        router.push("/page");
      } else {
        router.push("/signin");  // Redirect if role is undefined
      }
    };
    

    checkAuth().finally(() => setLoading(false));
    setChecked(true); // Mark as checked to prevent infinite loop
  }, [router, checked]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Redirect to signin page
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-white text-white">
        <LeadingScreen />
      </div>
    );
  }

  return (
    <div>
      {/* Page Content */}
      <div className="p-4">
        <h1 className="text-xl font-bold">Welcome to the Dashboard</h1>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Page;
