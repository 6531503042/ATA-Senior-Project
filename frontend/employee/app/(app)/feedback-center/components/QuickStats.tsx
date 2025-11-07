'use client';
import { Card, CardBody } from '@heroui/react';
import { ChartColumnBig } from 'lucide-react';
import React from 'react';

export default function QuickStats({ quickStats }: { quickStats: any }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex flex-row gap-2 items-center"><ChartColumnBig className='text-indigo-600 h-5 w-5'/>Quick Stats</h3>
        <div className="flex justify-between text-sm text-slate-800">
          <span>This Month</span><span>{quickStats?.thisMonth ?? 0}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-800">
          <span>Total Time</span><span>{quickStats?.totalTimeSeconds ?? 0}</span>
        </div>
      </CardBody>
    </Card>
  );
}
