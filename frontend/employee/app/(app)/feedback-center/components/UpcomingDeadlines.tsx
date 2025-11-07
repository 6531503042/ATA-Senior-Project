'use client';
import { Card, CardBody } from '@heroui/react';
import { Calendar } from 'lucide-react';
import React from 'react';

export default function UpcomingDeadlines({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="relative bg-gradient-to-br from-red-50/50 via-white to-white border border-red-100/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-400 to-orange-400 rounded-t-xl opacity-80" />
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <Calendar className="w-5 h-5 text-red-600" /> Upcoming Deadlines
        </h3>
        {feedbacks?.length ? (
          feedbacks.map(f => (
            <div
              key={f.id}
              className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] ${
                new Date(f.endDate).getTime() - Date.now() <
                3 * 24 * 60 * 60 * 1000
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-100 hover:bg-orange-100'
              }`}
            >
              <p className="text-slate-800 font-medium">{f.title}</p>
              <p className="text-sm text-slate-600">
                {new Date(f.endDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic">No upcoming deadlines</p>
        )}
      </CardBody>
    </Card>
  );
}
