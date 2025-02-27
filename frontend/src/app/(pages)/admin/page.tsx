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
import LoadingData from "@/components/shared/LoadingData/LoadingData";

const ComponentMap = {
  overview: Overview,
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
  const [targetComponent, setTargetComponent] = useState("overview");
  const router = useRouter();

  const handleComponentChange = (componentName: string) => {
    // Show loading when changing components
    setComponentLoading(true);

    setTargetComponent(componentName);

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

  const formatComponentName = (name: string) => {
    // Handle different formatting needs
    const parts = name.split("/");
    if (parts.length === 1) {
      // For "overview" case
      return name.charAt(0).toUpperCase() + name.slice(1);
    } else {
      // For "Project/dashboard" type cases
      const section = parts[0];
      const type = parts[1];
      return `${section} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
  };

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
            <LoadingData
              message={`Loading ${formatComponentName(targetComponent)}...`}
              secondaryMessage={`Preparing ${
                targetComponent.split("/").pop() || "dashboard"
              } view`}
              theme="gradient"
            />
          ) : (
            CurrentComponent && <CurrentComponent />
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
