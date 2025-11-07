'use client';
import { Card, CardBody } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
import React from 'react';

export default function PerformanceInsights() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance Insights
        </h3>
        <div className="p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-slate-800">Feedback Quality</p>
          <p className="text-xs text-slate-500">Based on responses</p>
        </div>
      </CardBody>
    </Card>
  );
}
