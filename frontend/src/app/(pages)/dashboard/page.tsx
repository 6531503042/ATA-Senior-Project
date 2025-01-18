"use client"

import Navbar from "@/app/components/navbar/navbar";
import React from "react";
import AiPowerInsight from '@/app/(pages)/dashboard/sections/ai_power_insights'
import HrDocumentation from '@/app/(pages)/dashboard/sections/hr_documentation'
import AdvanceDataAnalytics from '@/app/(pages)/dashboard/sections/advance_data_analytics'
import PreviewCard from '@/app/components/card/card_preview'

const page = () => {
  return (
    <div className="h-screen w-screen items-center flex gap-5 flex-col bg-white">
      <Navbar />
      <div className="w-4/5 h-auto border rounded-lg border-slate-50 shadow-lg">
        <AiPowerInsight/>
        <HrDocumentation/>
        <PreviewCard/>
        <AdvanceDataAnalytics/>
      </div>
    </div>
  );
};

export default page;
