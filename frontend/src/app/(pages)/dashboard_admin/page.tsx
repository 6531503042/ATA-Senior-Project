"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/app/components/sidebar/sidebar";
import Navbar from "@/app/components/navbar/navbar";
import Overview from '@/app/(pages)/dashboard_admin/section/overview';
import ProjectDashboard from '@/app/(pages)/dashboard_admin/section/project_dashboard';
import ProjectManage from '@/app/(pages)/dashboard_admin/section/project_manage';
import QuestionDashboard from '@/app/(pages)/dashboard_admin/section/question_dashboard';
import QuestionManage from '@/app/(pages)/dashboard_admin/section/question_manage';
import FeedbackDashboard from '@/app/(pages)/dashboard_admin/section/feedback_dashboard';
import FeedbackManage from '@/app/(pages)/dashboard_admin/section/feedback_manage';
import Score from './section/score_overall';
import { useRouter } from 'next/navigation'; // Correct import
import LeadingScreen from '@/app/components/loadingscreen/loadingscreen_admin'

const ComponentMap = {
  overview: Overview,
  score_overall: Score,
  project_dashboard: ProjectDashboard,
  project_manage: ProjectManage,
  question_dashboard: QuestionDashboard,
  question_manage: QuestionManage,
  feedback_dashboard: FeedbackDashboard,
  feedback_manage: FeedbackManage,
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [currentComponent, setCurrentComponent] = useState('overview');
  const router = useRouter(); // Use the useRouter hook for routing

  const handleComponentChange = (componentName: string) => {
    setCurrentComponent(componentName);
  };

  const CurrentComponent = ComponentMap[currentComponent as keyof typeof ComponentMap];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token"); // Use 'token' key for consistency
      const userInfo = localStorage.getItem("user");
    
      if (!token || !userInfo) {
        router.push("/signin");
        return;
      }
    
      const parsedUserInfo = JSON.parse(userInfo);
      const userRole = parsedUserInfo.roles ? parsedUserInfo.roles[0] : null;
    
      if (userRole === "ROLE_ADMIN") {
        router.push("/dashboard_admin");
      } else if (userRole === "ROLE_USER") {
        router.push("/user_page");
      } else {
        router.push("/signin");  // Redirect if role is undefined
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
    <div className='w-full h-screen flex flex-row '>
      <Sidebar onComponentChange={handleComponentChange} />
      <div className='flex-1 flex w-full flex-col overflow-y-auto overflow-x-auto'>
        <Navbar />
        <main className='p-12 max-w-full max-h-full min-w-[320px]'>
          {CurrentComponent && <CurrentComponent />}
        </main>
      </div>
    </div>
  );
};

export default Page;
