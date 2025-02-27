"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components//Navbar";
import Overview from "@/app/(pages)/admin/section/overview";
import ProjectDashboard from "@/app/(pages)/admin/section/Project/dashboard";
import ProjectManage from "@/app/(pages)/admin/section/Project/manage";
import QuestionDashboard from "@/app/(pages)/admin/section/Question/dashboard";
import QuestionManage from "@/app/(pages)/admin/section/Question/manage";
import FeedbackDashboard from "@/app/(pages)/admin/section/Feedback/dashboard";
import FeedbackManage from "@/app/(pages)/admin/section/Feedback/manage";
import { useRouter } from "next/navigation";
import LeadingScreen from "@/components/shared/loadingscreen/loadingscreen_admin";

const ComponentMap = {
  "overview": Overview,
  "Project/dashboard": ProjectDashboard,
  "Project/manage": ProjectManage,
  "Question/dashboard": QuestionDashboard,
  "Question/manage": QuestionManage,
  "Feedback/dashboard": FeedbackDashboard,
  "Feedback/manage": FeedbackManage,
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [componentLoading, setComponentLoading] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("overview");
  const router = useRouter();

  const handleComponentChange = (componentName: string) => {
    // Show loading when changing components
    setComponentLoading(true);
    
    // Set a minimum loading time of 2 seconds
    setTimeout(() => {
      setCurrentComponent(componentName);
      setComponentLoading(false);
    }, 2000);
  };

  const CurrentComponent =
    ComponentMap[currentComponent as keyof typeof ComponentMap];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
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
        router.push("/signin");
      }
    };

    checkAuth().finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-white text-white">
        <LeadingScreen />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-row">
      <Sidebar onComponentChange={handleComponentChange} />
      <div className="flex-1 flex w-full flex-col overflow-y-auto overflow-x-auto">
        <Navbar />
        <main className="p-4 md:p-12 max-w-full h-full min-w-[320px] relative">
          {componentLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-medium">Loading data...</p>
              </div>
            </div>
          ) : (
            CurrentComponent && <CurrentComponent />
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;