import {
  CircleAlert,
  Download,
  Lightbulb,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import React from "react";

const ai_power_insights = () => {
  return (
    <div className="p-5 flex flex-col w-full h-auto">
      <div className="flex flex-row items-center w-full h-auto justify-between py-3 px-8 rounded-t-xl border">
        <div className="flex flex-row text-violet-700 items-center gap-5">
          <Lightbulb />
          <div className="flex flex-col ">
            <h1 className="font-bold text-xl">AI-Powered Insights</h1>
            <p className="text-sm text-purple-500">
              Leveraging advanced machine learning algorithms for data-driven
              recommendations
            </p>
          </div>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>
      <div className="w-full h-auto rounded-b-xl border border-t-0 py-5 px-4 flex flex-col shadow-lg">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <div className="flex flex-row gap-2 items-center p-5 bg-violet-50 border border-violet-800 rounded-lg justify-between hover:scale-105 transition-all duration-500">
            <h1 className="font-semibold">Performance Insights</h1>
            <p className="text-xs flex flex-row gap-1 items-center border bg-red-200 border-red-700 p-2 rounded-xl">
              <TriangleAlert className="w-4 h-4" />
              High Priority
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center p-3 bg-violet-50 border border-violet-800 rounded-lg justify-between hover:scale-105 transition-all duration-500">
            <h1 className="font-semibold">Engagement Analysis</h1>
            <p className="text-xs flex flex-row gap-1 items-center border bg-amber-200 border-amber-700 p-2 rounded-xl">
              <CircleAlert className="w-4 h-4" />
              Medium Priority
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center p-3 bg-violet-50 border border-violet-800 rounded-lg justify-between hover:scale-105 transition-all duration-500">
            <h1 className="font-semibold">Improvement Opportunities</h1>
            <p className="text-xs flex flex-row gap-1 items-center border bg-green-200 border-green-700 p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              Low Priority
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ai_power_insights;
