'use client';
import { Card, CardBody } from '@heroui/react';
import { ClipboardList, Clock, CheckCircle2, Send } from 'lucide-react';
import React from 'react';

export default function StatsGrid({ stats }: { stats: any }) {
  const data = [
    {
      label: 'Total Feedbacks',
      value: stats?.totalFeedbacks ?? 0,
      icon: <ClipboardList className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: 'Pending',
      value: stats?.pendingFeedbacks ?? 0,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
    },
    {
      label: 'Completed',
      value: stats?.completedFeedbacks ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    {
      label: 'Submissions',
      value: stats?.totalSubmissions ?? 0,
      icon: <Send className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, i) => (
        <Card
          key={i}
          className="bg-white border border-slate-200/70 rounded-xl 
                     shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] 
                     transition-all duration-200"
        >
          <CardBody className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>
              {item.icon}
            </div>
            <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
