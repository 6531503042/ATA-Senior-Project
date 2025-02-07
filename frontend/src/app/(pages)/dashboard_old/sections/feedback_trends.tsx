import { Download, FileText } from "lucide-react";
import React from "react";

const feedback_trends = () => {
  return (
    <div className="p-5 flex flex-col w-full h-auto">
      <div className="flex flex-row items-center w-full h-auto justify-between py-3 px-8 rounded-xl border">
        <div className="flex flex-row text-violet-700 items-center gap-5">
          <FileText />
          <div className="flex flex-col ">
            <h1 className="font-bold text-xl">Feedback Trends</h1>
            <p className="text-sm text-purple-500">
              Monthly tracking of key metrics
            </p>
          </div>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
            Export
            <Download className="h-4 w-4" />
          </button>
      </div>
    </div>
  );
};

export default feedback_trends;
