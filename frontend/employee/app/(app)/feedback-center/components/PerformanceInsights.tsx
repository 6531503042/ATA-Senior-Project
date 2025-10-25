'use client';
import { Card, CardBody } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
import React from 'react';

export default function PerformanceInsights() {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 ">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Performance Insights
        </h3>
        <div className="p-3 bg-indigo-50  rounded">
          <p className="text-sm text-gray-800 ">Feedback Quality</p>
          <p className="text-xs text-gray-600 ">Based on responses</p>
        </div>
      </CardBody>
    </Card>
  );
}
