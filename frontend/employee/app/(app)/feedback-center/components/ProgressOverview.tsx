'use client';
import { Card, CardBody } from '@heroui/react';
import { CircleDashed } from 'lucide-react';
import React from 'react';

export default function ProgressOverview() {
  return (
    <Card className="relative bg-gradient-to-br from-teal-50 via-white to-slate-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 to-green-400 rounded-t-xl opacity-80" />
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <CircleDashed className="text-blue-400 h-5 w-5" /> Progress Overview
        </h3>
        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-600">
            <span>Completion Rate</span>
            <span className="font-semibold text-slate-900">75%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full animate-pulse"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
