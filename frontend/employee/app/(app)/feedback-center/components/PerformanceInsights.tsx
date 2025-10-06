'use client';
import { Card, CardBody } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
import React from 'react';

export default function PerformanceInsights() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance Insights
        </h3>
        <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded">
          <p className="text-sm text-slate-800 dark:text-slate-200">Feedback Quality</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Based on responses</p>
        </div>
      </CardBody>
    </Card>
  );
}
