import { Download, FileText, TrendingUp } from "lucide-react";
import React from "react";
import { RadialBar, RadialBarChart } from "recharts";

const satisfaction_overview = () => {
  const data = [{ name: "Satisfaction", value: 87 }];
  const sentimentData = [
    { label: "Positive", value: "85.2%", color: "text-green-500", emoji: "😃" },
    { label: "Neutral", value: "8.6%", color: "text-yellow-500", emoji: "😐" },
    { label: "Negative", value: "6.2%", color: "text-red-500", emoji: "😞" },
  ];

  return (
    <div className="p-5 flex w-full h-auto">
      <div className="border shadow-xl py-3 px-8 rounded-xl flex flex-col w-full gap-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col justify-start items-center">
            <h1>Overall Satisfaction</h1>
            <div className="flex flex-row items-center">
              <p className="text-zinc-600 text-sm">0%</p>
              <div className="my-6 flex flex-col items-center">
                <RadialBarChart
                  width={200}
                  height={140}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  barSize={10}
                  data={data}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar background dataKey="value" fill="#9333EA" />
                </RadialBarChart>
                <div className="text-center mt-[-30px]">
                  <span className="text-3xl font-bold text-purple-600">
                    87%
                  </span>
                  <p className="text-gray-500 font-thin">Satisfaction Rate</p>
                </div>
              </div>
              <p className="text-zinc-600 text-sm">100%</p>
            </div>
            <div className="flex flex-row w-3/4 p-5 justify-between rounded-lg bg-slate-50">
              <div className="flex flex-col ">
                <span className="text-zinc-600 text-base">
                  Year-over-Year Change
                </span>
                <span className="text-green-500 inline-flex flex-row gap-1">
                  <TrendingUp />
                  2.0%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-600 text-base">Previous Year</span>
                <span className="text-black font-semibold">85%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1>Sentiment Distribution</h1>
            <div className="grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center gap-10 mt-4">
              {sentimentData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md lg:p-10 p-6 rounded-lg text-center hover:shadow-xl hover:scale-105 transition-all duration-200 flex flex-col gap-1"
                >
                  <div className="text-5xl">{item.emoji}</div>
                  <p className={`text-xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default satisfaction_overview;
