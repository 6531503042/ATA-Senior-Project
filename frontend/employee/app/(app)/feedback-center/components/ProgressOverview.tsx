'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function ProgressOverview() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Progress Overview</h3>
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
            <span>Completion Rate</span><span className="font-semibold text-slate-900 dark:text-slate-100">0%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
