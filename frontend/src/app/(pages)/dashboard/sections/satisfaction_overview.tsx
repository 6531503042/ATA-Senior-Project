import { Download, FileText } from "lucide-react";
import React from "react";

const satisfaction_overview = () => {
  return (
    <div className="p-5 flex w-full h-auto">
      <div className="border shadow-xl py-3 px-8 rounded-xl flex flex-col w-full gap-4">
      <div className="flex flex-row items-center w-full h-auto justify-between   ">
        <div className="flex flex-row text-violet-700 items-center gap-5">
          <FileText />
          <div className="flex flex-col ">
            <h1 className="font-bold text-xl">Satisfaction Overview</h1>
            <p className="text-sm text-purple-800">
              Year-over-year satisfaction analysis and sentiment distribution
            </p>
          </div>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>Overall Satisfaction</div>
        <div>Sentiment Distribution</div>
      </div>
      </div>
    </div>
  );
};

export default satisfaction_overview;
