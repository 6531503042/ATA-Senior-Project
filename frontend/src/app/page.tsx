"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Background from "@/app/assets/background.png";
import LeadingScreen from '@/app/components/loadingscreen/loadingscreen_admin';
import { useAuthRedirect } from "../../utils/useAuthRedirect"; // Import the custom hook

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Use the custom hook for authentication redirect logic
  useAuthRedirect();

  useEffect(() => {
    // Show loading screen for a short time (500ms) while checking authentication
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="w-screen h-screen bg-white text-white">
        <LeadingScreen />
      </div>
    );
  }

  // If everything is fine, show the background
  return (
    <div className="w-screen h-screen overflow-hidden">
      <img src={Background.src} alt="Background" className="w-screen h-screen object-cover" />
    </div>
  );
}
