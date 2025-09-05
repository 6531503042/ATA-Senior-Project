"use client";

import { Card, CardBody } from "@heroui/react";

type Props = {
  total: number;
  analyzed: number;
  pending: number;
};

export default function SubmissionMetrics({ total, analyzed, pending }: Props) {
  const completedPct = total > 0 ? Math.round((analyzed / total) * 100) : 0;

  const statsCards = [
    {
      title: "Total Submissions",
      value: total.toLocaleString(),
      description: "All submissions",
      icon: TotalIcon,
      bgColor: "from-blue-500 to-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      title: "Analyzed",
      value: analyzed.toLocaleString(),
      description: "Completed analysis",
      icon: AnalyzedIcon,
      bgColor: "from-emerald-500 to-emerald-600",
      gradient: "from-emerald-500/20 to-emerald-600/20",
    },
    {
      title: "Pending",
      value: pending.toLocaleString(),
      description: `${completedPct}% complete`,
      icon: PendingIcon,
      bgColor: "from-orange-500 to-orange-600",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => (
        <Card 
          key={index} 
          className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
        >
          <CardBody className="p-6 relative">
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-default-900">{stat.value}</p>
                <p className="text-xs text-default-400 mt-1">{stat.description}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

// Clean, modern icons as components
function TotalIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className}>
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
      />
    </svg>
  );
}

function AnalyzedIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className}>
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}

function PendingIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className}>
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
}