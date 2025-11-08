'use client';
import { Card, CardBody } from '@heroui/react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PendingFeedbacks({ feedbacks }: { feedbacks: any[] }) {
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'not_started':
      default:
        return 'bg-red-50/50 border-red-200 hover:bg-red-100';
    }
  };

  return (
    <Card className="relative bg-gradient-to-br from-red-50/50 via-white to-white border border-red-100/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-400 to-orange-400 rounded-t-xl opacity-80" />
      <CardBody className="p-7 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-orange-600" /> Pending Feedbacks
        </h2>

        {feedbacks?.length ? (
          <div className="space-y-3">
            {feedbacks.map(f => (
              <Link
                key={f.id}
                href={`/feedback/${f.id}`}
                className={`relative block p-4 rounded-xl border transition-all duration-200 
              hover:scale-[1.01] overflow-hidden
              ${getStatusStyle(f.status)}`}
              >
                <span
                  className={`
      absolute left-0 top-0 h-full w-[6px] rounded-l-xl 
      ${
        f.status === 'completed'
          ? 'bg-green-500'
          : f.status === 'in_progress'
          ? 'bg-yellow-400'
          : 'bg-red-400'
      }
    `}
                />

                {/* content */}
                <div className="flex justify-between items-center ms-2">
                  <p className="font-medium text-slate-800">{f.title}</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      f.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : f.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {f.status === 'completed'
                      ? 'Completed'
                      : f.status === 'in_progress'
                      ? 'In Progress'
                      : 'Not Started'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-1 flex items-center gap-1 ms-2">
                  🕦 Due: {new Date(f.endDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No feedbacks found</p>
        )}
      </CardBody>
    </Card>
  );
}
