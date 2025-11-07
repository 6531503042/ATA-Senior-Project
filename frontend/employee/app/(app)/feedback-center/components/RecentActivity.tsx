'use client';
import { Card, CardBody } from '@heroui/react';
import { SquareActivity } from 'lucide-react';
import React from 'react';

export default function RecentActivity() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex flex-row gap-2 items-center"><SquareActivity className='text-indigo-600 h-5 w-5'/>Recent Activity</h3>
        <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
          <p className="text-sm text-slate-800">Logged in</p>
          <p className="text-xs text-slate-500">Just now</p>
        </div>
      </CardBody>
    </Card>
  );
}
