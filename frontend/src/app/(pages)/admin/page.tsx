"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/(pages)/admin/components/sidebar/sidebar";
import Navbar from "@/app/components/navbar/navbar";
import Overview from "@/app/(pages)/admin/section/overview";
import ProjectDashboard from "@/app/(pages)/admin/section/Project/dashboard";
import ProjectManage from "@/app/(pages)/admin/section/Project/manage";
import QuestionDashboard from "@/app/(pages)/admin/section/Question/dashboard";
import QuestionManage from "@/app/(pages)/admin/section/Question/manage";
import FeedbackDashboard from "@/app/(pages)/admin/section/Feedback/dashboard";
import FeedbackManage from "@/app/(pages)/admin/section/Feedback/manage";
import Score from "./section/score_overall";
import { useRouter } from "next/navigation";
import LeadingScreen from "@/components/loadingscreen/loadingscreen_admin";

const ComponentMap = {
  "overview": Overview,
  "score_overall": Score,
  "Project/dashboard": ProjectDashboard,
  "Project/manage": ProjectManage,
  "Question/dashboard": QuestionDashboard,
  "Question/manage": QuestionManage,
  "Feedback/dashboard": FeedbackDashboard,
  "Feedback/manage": FeedbackManage,
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [currentComponent, setCurrentComponent] = useState("overview");
  const router = useRouter();

  const handleComponentChange = (componentName: string) => {
    setCurrentComponent(componentName);
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
        <main className="p-4 md:p-12 max-w-full max-h-full min-w-[320px]">
          {CurrentComponent && <CurrentComponent />}
        </main>
      </div>
    </div>
  );
};

export default Page;