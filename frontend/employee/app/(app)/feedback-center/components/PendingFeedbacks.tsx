'use client';
import { Card, CardBody } from '@heroui/react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PendingFeedbacks({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-orange-600" /> Pending Feedbacks
        </h2>
        {feedbacks?.length ? (
          <div className="space-y-3">
            {feedbacks.slice(0, 3).map(f => (
              <Link
                key={f.id}
                href={`/feedback/${f.id}`}
                className="block p-4 rounded-xl bg-orange-50/70 hover:bg-orange-100 border border-orange-100 transition"
              >
                <p className="font-medium text-slate-800">{f.title}</p>
                <p className="text-sm text-slate-600">
                  Due: {new Date(f.endDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No pending feedbacks</p>
        )}
      </CardBody>
    </Card>
  );
}
