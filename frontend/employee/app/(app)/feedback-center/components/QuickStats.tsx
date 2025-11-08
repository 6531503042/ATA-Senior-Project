'use client';
import { Card, CardBody } from '@heroui/react';
import { ChartColumnBig } from 'lucide-react';
import React from 'react';

export default function QuickStats({ quickStats }: { quickStats: any }) {
  return (
    <Card className="relative bg-gradient-to-br from-sky-50/70 via-white to-white 
                     border border-sky-100/70 rounded-xl shadow-sm 
                     hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-sky-400 to-indigo-400 rounded-t-xl opacity-80" />

      <CardBody className="p-7 space-y-4 relative">
        <h3 className="text-lg font-semibold flex flex-row gap-2 items-center text-slate-900">
          <ChartColumnBig className="text-sky-500 h-5 w-5" /> Quick Stats
        </h3>
        <div className="flex justify-between text-sm text-slate-800">
          <span>This Month</span>
          <span>{quickStats?.thisMonth ?? 0}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-800">
          <span>Total Time</span>
          <span>{quickStats?.totalTimeSeconds ?? 0}</span>
        </div>
      </CardBody>
    </Card>
  );
}
