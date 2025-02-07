import { FileText, Calendar, Download, ChevronRight } from "lucide-react";
import React from "react";

const advance_data_analytics = () => {
  return (
    <div className="p-5 w-full h-auto">
      <div className="flex flex-col w-full h-auto border rounded-xl shadow-xl">
        <div className="flex flex-row items-center w-full h-auto justify-between py-3 px-8 border-b">
          <div className="flex flex-row text-violet-700 items-center gap-5">
            <FileText />
            <div className="flex flex-col ">
              <h1 className="font-bold text-xl">Advanced Data Analytics</h1>
              <p className="text-sm text-purple-800">
                AI-powered insights and predictive analytics
              </p>
            </div>
          </div>
          <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
            Export
            <Download className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full h-auto py-5 px-8 flex flex-col">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
            <div className="flex flex-col gap-4 p-5 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg border border-zinc-50">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center justify-between">
                <p className="flex flex-row gap-2">
                  <Calendar className="w-6 h-6" />
                  Predictive Analytics
                </p>
                <ChevronRight className="cursor-pointer w-8 h-8 p-1 rounded-full hover:bg-zinc-200 transition-all duration-100" />
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                AI-powered predictions for potential future concerns and trends
              </span>
              <div className="flex w-full flex-row justify-between gap-5">
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">Prediction Accuracy</p>
                  <p className="text-violet-700 text-lg font-bold">94%</p>
                </div>
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">Issues Prevented</p>
                  <p className="text-violet-700 text-lg font-bold">23</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-5 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg border border-zinc-50">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center justify-between">
                <p className="flex flex-row gap-2">
                  <Calendar className="w-6 h-6" />
                  Interactive Analytics
                </p>
                <ChevronRight className="cursor-pointer w-8 h-8 p-1 rounded-full hover:bg-zinc-200 transition-all duration-100" />
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Visual insights into engagement trends and sentiment patterns
              </span>
              <div className="flex w-full flex-row justify-between gap-5">
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">Active Users</p>
                  <p className="text-violet-700 text-lg font-bold">1.2k</p>
                </div>
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">Insights Generated</p>
                  <p className="text-violet-700 text-lg font-bold">89</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-5 rounded-lg justify-between hover:scale-105 transition-all duration-500 shadow-lg border border-zinc-50">
              <h1 className="font-semibold text-base text-violet-700 flex flex-row items-center justify-between">
                <p className="flex flex-row gap-2">
                  <Calendar className="w-6 h-6" />
                  Impact Tracking
                </p>
                <ChevronRight className="cursor-pointer w-8 h-8 p-1 rounded-full hover:bg-zinc-200 transition-all duration-100" />
              </h1>
              <span className="font-thin text-sm text-zinc-600">
                Monitor outcomes of HR interventions and satisfaction changes
              </span>
              <div className="flex w-full flex-row justify-between gap-5">
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">Success Rate</p>
                  <p className="text-violet-700 text-lg font-bold">87%</p>
                </div>
                <div className="flex w-full flex-col bg-zinc-50 p-3 rounded-xl">
                  <p className="text-zinc-500 text-sm">ROI</p>
                  <p className="text-violet-700 text-lg font-bold">+32%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default advance_data_analytics;
