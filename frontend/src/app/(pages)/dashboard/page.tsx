"use client";

import Navbar from "@/app/components/navbar/navbar";
import React from "react";
import AiPowerInsight from "@/app/(pages)/dashboard/sections/ai_power_insights";
import HrDocumentation from "@/app/(pages)/dashboard/sections/hr_documentation";
import AdvanceDataAnalytics from "@/app/(pages)/dashboard/sections/advance_data_analytics";
import AreaImprovement from "@/app/(pages)/dashboard/sections/area_improvement";
import UserSegmentation from "@/app/(pages)/dashboard/sections/user_segmentation";
import SatisfactionOverview from "@/app/(pages)/dashboard/sections/satisfaction_overview";
import FeedbackTrends from "@/app/(pages)/dashboard/sections/feedback_trends";
import FloatBar from "@/app/components/floatbar/floatbar";
import Testing from "@/app/(pages)/dashboard/sections/testing";
import PreviewCard from "@/app/components/card/card_preview";

const page = () => {
  return (
    <div className="h-auto w-auto items-center flex gap-5 flex-col bg-white">
      <Navbar />
      
      <div className="p-5">{/*spacing*/}</div>
      <div className="w-4/5 h-auto border rounded-lg border-slate-50 shadow-lg mt-5">
        <AiPowerInsight />
        <HrDocumentation />
        <PreviewCard />
        <AdvanceDataAnalytics />
        <div className="p-5 w-full h-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <UserSegmentation />
            <AreaImprovement />
          </div>
        </div>
        <SatisfactionOverview/>
        <FeedbackTrends/>
        {/* <Testing/> */}
      </div>
      <FloatBar/>
    </div>
  );
};

export default page;
