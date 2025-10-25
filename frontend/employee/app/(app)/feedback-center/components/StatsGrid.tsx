'use client';

import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function StatsGrid({ stats }: { stats: any }) {
  const data = [
    { label: 'Total Feedbacks', value: stats?.totalFeedbacks ?? 0 },
    { label: 'Pending', value: stats?.pendingFeedbacks ?? 0 },
    { label: 'Completed', value: stats?.completedFeedbacks ?? 0 },
    { label: 'Submissions', value: stats?.totalSubmissions ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, i) => (
        <Card
          key={i}
          className="bg-white/90 /90 border border-gray-200  shadow-sm hover:shadow transition"
        >
          <CardBody className="p-5">
            <p className="text-sm font-medium text-gray-600 ">{item.label}</p>
            <p className="text-3xl font-bold text-gray-900  mt-1">{item.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
