import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import React from "react";

interface Segment {
  name: string;
  count: number;
  change: number;
  color: string;
}

const UserSegmentation: React.FC = () => {
  const segments: Segment[] = [
    { name: "Highly Engaged", count: 273, change: 3, color: "bg-emerald-500" },
    { name: "Satisfied", count: 108, change: 5, color: "bg-blue-500" },
    { name: "Neutral", count: 530, change: -5, color: "bg-orange-400" },
    { name: "At Risk", count: 494, change: -9, color: "bg-red-500" },
    { name: "New Hire", count: 522, change: -8, color: "bg-purple-500" },
    { name: "Veteran Employee", count: 302, change: -2, color: "bg-pink-500" },
    { name: "Leadership", count: 462, change: 3, color: "bg-teal-500" },
    { name: "Remote Worker", count: 242, change: -1, color: "bg-amber-500" },
  ];

  const totalEmployees: number = segments.reduce(
    (sum, segment) => sum + segment.count,
    0
  );

  const getBarWidth = (count: number): string => {
    return `${(count / totalEmployees) * 100}%`;
  };

  return (
    <div className="flex flex-col w-full h-auto p-6 rounded-xl border shadow-lg gap-8">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-violet-700">
            User Segmentation
          </h1>
          <span className="text-sm font-thin text-zinc-600">
            Employee distribution across segments for Overall
          </span>
        </div>
        <div className="flex flex-col items-end">
          <h1 className="text-sm font-thin text-zinc-600">Total Employees</h1>
          <p className="text-xl font-bold text-violet-700">{totalEmployees}</p>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {segments.map((segment) => (
          <div key={segment.name} className="space-y-4 hover:bg-slate-50 rounded-lg duration-100 p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${segment.color}`} />
                <span className="text-gray-700 text-sm font-semibold">
                  {segment.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{segment.count}</span>
                {segment.change !== 0 && (
                  <div
                    className={`flex items-center gap-1 ${
                      segment.change > 0
                        ? "text-green-500 text-sm"
                        : "text-red-500 text-sm"
                    }`}
                  >
                    {segment.change > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(segment.change)}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${segment.color} transition-all duration-300 rounded-full`}
                style={{ width: getBarWidth(segment.count) }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-fuchsia-100 rounded-lg flex flex-col gap-3">
        <h1 className="font-semibold text-violet-700 text-lg">Project Breakdown</h1>
        <div className="grid grid-cols-2 gap-4 text-base">
          <div className="flex flex-row justify-between text-zinc-700">
            <p className="font-thin">Engineering</p>
            <p className="font-semibold">35%</p>
          </div>
          <div className="flex flex-row justify-between text-zinc-700">
            <p className="font-thin">Marketing</p>
            <p className="font-semibold">25%</p>
          </div>
          <div className="flex flex-row justify-between text-zinc-700">
            <p className="font-thin">Sales</p>
            <p className="font-semibold">20%</p>
          </div>
          <div className="flex flex-row justify-between text-zinc-700">
            <p className="font-thin">Other</p>
            <p className="font-semibold">20%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSegmentation;
