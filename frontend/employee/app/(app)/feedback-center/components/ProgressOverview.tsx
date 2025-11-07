'use client';
import { Card, CardBody,} from '@heroui/react';
import { CircleDashed } from 'lucide-react';
import React from 'react';

export default function ProgressOverview() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex flex-row gap-2 items-center"><CircleDashed className='text-blue-400 h-5 w-5'/>Progress Overview</h3>
        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-600">
            <span>Completion Rate</span>
            <span className="font-semibold text-slate-900">0%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
