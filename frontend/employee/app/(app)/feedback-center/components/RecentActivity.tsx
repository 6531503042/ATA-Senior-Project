'use client';
import { Card, CardBody } from '@heroui/react';
import { SquareActivity } from 'lucide-react';
import React from 'react';

export default function RecentActivity() {
  return (
    <Card className="relative bg-gradient-to-br from-indigo-50 via-white to-white 
                      border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 to-blue-400 rounded-t-xl opacity-80" />
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <SquareActivity className="text-indigo-500 h-5 w-5" /> Recent Activity
        </h3>
        <div className="p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-all duration-200 hover:scale-[1.01]">
          <p className="text-sm text-slate-800">Logged in</p>
          <p className="text-xs text-slate-500">Just now</p>
        </div>
      </CardBody>
    </Card>
  );
}
