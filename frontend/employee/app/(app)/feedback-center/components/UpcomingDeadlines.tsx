'use client';
import { Card, CardBody } from '@heroui/react';
import { Calendar } from 'lucide-react';
import React from 'react';

export default function UpcomingDeadlines({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 ">
          <Calendar className="w-5 h-5 text-red-600" /> Upcoming Deadlines
        </h3>
        {feedbacks?.length ? feedbacks.slice(0, 2).map(f => (
          <div key={f.id} className="p-3 bg-orange-50  rounded">
            <p className="text-gray-800 ">{f.title}</p>
            <p className="text-sm text-gray-600 ">
              {new Date(f.endDate).toLocaleDateString()}
            </p>
          </div>
        )) : <p className="text-sm text-gray-600 ">No upcoming deadlines</p>}
      </CardBody>
    </Card>
  );
}
