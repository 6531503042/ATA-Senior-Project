"use client";

import { useEffect, useState } from "react";
import Background from "@assets/background.png";
import LeadingScreen from '@/components/shared/loadingscreen/loadingscreen_admin';
import { useAuthRedirect } from "../../utils/useAuthRedirect"; 

export default function Home() {
  const [loading, setLoading] = useState(true);
  
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
