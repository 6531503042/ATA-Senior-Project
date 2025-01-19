import { Download, Building2, MessageSquare, TrendingUp, Scale, Users, Crown } from "lucide-react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip  } from "recharts";

interface MetricData {
  name: string;
  current: number;
  target: number;
  icon: React.ReactNode;
}

const AreaImprovement: React.FC = () => {
  const metrics: MetricData[] = [
    {
      name: "Work Environment",
      current: 45,
      target: 80,
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      name: "Communication",
      current: 65,
      target: 90,
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      name: "Career Growth",
      current: 55,
      target: 85,
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      name: "Work-Life Balance",
      current: 70,
      target: 85,
      icon: <Scale className="w-6 h-6" />,
    },
    {
      name: "Team Collaboration",
      current: 75,
      target: 90,
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Leadership Support",
      current: 60,
      target: 85,
      icon: <Crown className="w-6 h-6" />,
    },
  ];

  const chartData = metrics.map((metric) => ({
    name: metric.name,
    "Current Score": metric.current,
    "Target Score": metric.target,
  }));
  const RoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;

    return (
      <path
        d={`
          M${x},${y + height}
          L${x},${y + 10}
          Q${x},${y} ${x + 10},${y}
          L${x + width - 10},${y}
          Q${x + width},${y} ${x + width},${y + 10}
          L${x + width},${y + height}
          Z
        `}
        fill={fill}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.fill }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full h-auto p-6 rounded-xl border shadow-lg gap-8">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-violet-700">
            Areas for Improvement
          </h1>
          <span className="text-sm font-thin text-zinc-600">
            Current performance vs target metrics
          </span>
        </div>
        <button className="flex-row flex gap-3 justify-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-purple-50 p-4 rounded-lg flex flex-col gap-4 hover:shadow-xl shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                {metric.icon}
              </div>
              <span className="font-medium text-sm">{metric.name}</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Current</span>
                  <span className="text-violet-700">{metric.current}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      metric.current < 60
                        ? "bg-red-500"
                        : metric.current < 75
                        ? "bg-orange-400"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${metric.current}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Target</span>
                  <span className="text-blue-500">{metric.target}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${metric.target}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%" >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            
          >
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fill: '#666', fontSize: 10 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#666', fontSize: 11 }}
            />
            <Tooltip 
              content={CustomTooltip}
              cursor={{ fill: 'transparent' }}
            />
            <Bar 
              dataKey="Current Score" 
              fill="#C084FC" 
              shape={<RoundedBar />}
              radius={[10, 10, 0, 0]}
            />
            <Bar 
              dataKey="Target Score" 
              fill="#93C5FD" 
              shape={<RoundedBar />}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaImprovement;