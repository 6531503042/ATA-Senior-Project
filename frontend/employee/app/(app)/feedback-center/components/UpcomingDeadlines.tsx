'use client';
import { Card, CardBody } from '@heroui/react';
import { Calendar } from 'lucide-react';
import React from 'react';

export default function UpcomingDeadlines({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <Calendar className="w-5 h-5 text-red-600" /> Upcoming Deadlines
        </h3>
        {feedbacks?.length ? (
          feedbacks.slice(0, 2).map(f => (
            <div key={f.id} className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
              <p className="text-slate-800">{f.title}</p>
              <p className="text-sm text-slate-600">{new Date(f.endDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic">No upcoming deadlines</p>
        )}
      </CardBody>
    </Card>
  );
}
