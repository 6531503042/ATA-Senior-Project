'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function QuickStats({ quickStats }: { quickStats: any }) {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 ">Quick Stats</h3>
        <div className="flex justify-between text-sm text-gray-800 ">
          <span>This Month</span><span>{quickStats?.thisMonth ?? 0}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-800 ">
          <span>Total Time</span><span>{quickStats?.totalTimeSeconds ?? 0}</span>
        </div>
      </CardBody>
    </Card>
  );
}
