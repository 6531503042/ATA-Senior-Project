"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Background from "@/app/assets/background.png";
import LeadingScreen from '@/components/loadingscreen/loadingscreen_admin';
import { useAuthRedirect } from "../../utils/useAuthRedirect"; 

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Use the custom hook for authentication redirect logic
  useAuthRedirect();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  if (loading) {
    return (
      <div className="w-screen h-screen bg-white text-white">
        <LeadingScreen />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <img src={Background.src} alt="Background" className="w-screen h-screen object-cover" />
    </div>
  );
}
