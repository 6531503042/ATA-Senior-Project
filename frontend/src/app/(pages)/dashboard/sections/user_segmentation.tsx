import { Download } from "lucide-react";
import React from "react";

const user_segmentation = () => {
  return (
    <div className="flex w-full h-auto py-3 px-5 rounded-xl border shadow-lg">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-violet-700">
            User Segmentation
          </h1>
          <span className="text-sm font-thin text-zinc-600">
            Employee distribution across segments for Overall
          </span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-thin text-zinc-600">Total Employees</h1>
          <p className="text-xl font-bold text-violet-700">2933</p>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default user_segmentation;
