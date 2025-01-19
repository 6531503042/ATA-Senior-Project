"use client";
import { RadialBarChart, RadialBar } from "recharts";

const data = [{ name: "Satisfaction", value: 87 }];

const sentimentData = [
  { label: "Positive", value: "85.2%", color: "text-green-500", emoji: "😃" },
  { label: "Neutral", value: "8.6%", color: "text-yellow-500", emoji: "😐" },
  { label: "Negative", value: "6.2%", color: "text-red-500", emoji: "😞" },
];

export default function SatisfactionDashboard() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold text-purple-600">
        Satisfaction Overview
      </h2>
      <p className="text-gray-500">
        Year-over-year satisfaction analysis and sentiment distribution
      </p>

      {/* Gauge Chart */}
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
          <span className="text-3xl font-bold text-purple-600">87%</span>
          <p className="text-gray-500">Satisfaction Rate</p>
        </div>
      </div>

      {/* Year-over-Year Change */}
      <div className="flex justify-between bg-white p-4 rounded-lg shadow-md mt-4">
        <div>
          <p className="text-gray-500 text-sm">Year-over-Year Change</p>
          <p className="text-green-500 font-bold">⬆ 2.0%</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Previous Year</p>
          <p className="font-bold">85%</p>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <h3 className="text-xl font-bold text-gray-700 mt-6">
        Sentiment Distribution
      </h3>
      <div className="flex justify-center gap-4 mt-4">
        {sentimentData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 rounded-lg text-center w-24"
          >
            <div className="text-3xl">{item.emoji}</div>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
