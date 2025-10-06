'use client';
import { Card, CardBody } from '@heroui/react';
import { Calendar } from 'lucide-react';
import React from 'react';

export default function UpcomingDeadlines({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Calendar className="w-5 h-5 text-red-600" /> Upcoming Deadlines
        </h3>
        {feedbacks?.length ? feedbacks.slice(0, 2).map(f => (
          <div key={f.id} className="p-3 bg-orange-50 dark:bg-slate-800 rounded">
            <p className="text-slate-800 dark:text-slate-200">{f.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(f.endDate).toLocaleDateString()}
            </p>
          </div>
        )) : <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming deadlines</p>}
      </CardBody>
    </Card>
  );
}
