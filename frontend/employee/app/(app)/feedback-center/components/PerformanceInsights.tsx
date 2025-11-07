'use client';
import { Card, CardBody } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
import React from 'react';

export default function PerformanceInsights() {
  return (
    <Card className="relative bg-gradient-to-br from-indigo-50/70 via-white to-white 
                     border border-indigo-100/70 rounded-xl shadow-sm 
                     hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-xl opacity-80" />
      
      <CardBody className="p-7 space-y-4 relative">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance Insights
        </h3>
        <div className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200">
          <p className="text-sm text-slate-800">Feedback Quality</p>
          <p className="text-xs text-slate-500">Based on responses</p>
        </div>
      </CardBody>
    </Card>
  );
}
