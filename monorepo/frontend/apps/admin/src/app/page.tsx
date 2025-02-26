"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@shared/components/sidebar";
import Navbar from "@shared/components/Navbar";
import Overview from "./section/overview";
import ProjectDashboard from "./section/Project/dashboard";
import ProjectManage from "./section/Project/manage";
import QuestionDashboard from "./section/Question/dashboard";
import QuestionManage from "./section/Question/manage";
import FeedbackDashboard from "./section/Feedback/dashboard";
import FeedbackManage from "./section/Feedback/manage";
import Score from "./section/score_overall";
import { useRouter } from "next/navigation";
import LeadingScreen from '@shared/loadingscreen/loadingscreen_admin';

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
        router.push("http://localhost:3001");
        return;
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const userRole = parsedUserInfo.roles ? parsedUserInfo.roles[0] : null;

      if (userRole === "ROLE_ADMIN") {
        router.push("http://localhost:3001");
      } else if (userRole === "ROLE_USER") {
        router.push("http://localhost:3002");
      } else {
        router.push("http://localhost:3001");
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