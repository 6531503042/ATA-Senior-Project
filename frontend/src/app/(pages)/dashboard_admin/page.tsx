"use client";

import React, { useState } from 'react';
import Sidebar from "@/app/components/sidebar/sidebar";
import Navbar from "@/app/components/navbar/navbar";
import Overview from '@/app/(pages)/dashboard_admin/section/overview';
import ProjectDashboard from '@/app/(pages)/dashboard_admin/section/project_dashboard';
import ProjectManage from '@/app/(pages)/dashboard_admin/section/project_manage';
import QuestionDashboard from '@/app/(pages)/dashboard_admin/section/question_dashboard';
import QuestionManage from '@/app/(pages)/dashboard_admin/section/question_manage';
import FeedbackDashboard from '@/app/(pages)/dashboard_admin/section/feedback_dashboard';
import FeedbackManage from '@/app/(pages)/dashboard_admin/section/feedback_manage';

const ComponentMap = {
  overview: Overview,
  project_dashboard: ProjectDashboard,
  project_manage: ProjectManage,
  question_dashboard: QuestionDashboard,
  question_manage: QuestionManage,
  feedback_dashboard: FeedbackDashboard,
  feedback_manage: FeedbackManage,
};

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState('overview');

  // This function will be passed to Sidebar as a prop
  const handleComponentChange = (componentName: string) => {
    setCurrentComponent(componentName);
  };

  // Dynamically render the selected component
  const CurrentComponent = ComponentMap[currentComponent as keyof typeof ComponentMap];

  return (
    <div className='w-screen h-screen flex flex-row'>
      <Sidebar onComponentChange={handleComponentChange} />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='flex-1 p-6'>
          {CurrentComponent && <CurrentComponent />}
        </main>
      </div>
    </div>
  );
};

export default Page;