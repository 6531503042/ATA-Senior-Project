import { Download, FileText, Calendar } from "lucide-react";
import React from "react";

const hr_documentation = () => {
  return (
    <div className="p-5 w-full h-auto">
      <div className="flex flex-col w-full h-auto border rounded-xl shadow-xl">
        <div className="flex flex-row items-center w-full h-auto justify-between py-3 px-8 border-b">
          <div className="flex flex-row text-violet-700 items-center gap-5">
            <FileText />
            <div className="flex flex-col ">
              <h1 className="font-bold text-xl">HR Documentation Center</h1>
              <p className="text-sm text-purple-500">
                Generate comprehensive reports and strategic plans
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-auto  py-5 px-8 flex flex-col ">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Yearly Summary
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Comprehensive overview of the year's feedback, metrics, and
                achievements
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Strategic Planning
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Next year's strategic initiatives and improvement plans
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Performance Analytics
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Detailed performance metrics and trend analysis
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Talent Management
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Employee development and succession planning
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Compliance Report
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Regulatory compliance and policy adherence summary
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5 bg-violet-50 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center gap-2">
                <Calendar className="w-6 h-6" />
                Recognition & Awards
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Employee recognition and achievements documentation
              </span>
              <button className="flex flex-row w-full justify-center items-center gap-3 rounded-lg bg-black p-2 text-white hover:shadow-lg duration-300">
                Generate Summary
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default hr_documentation;
