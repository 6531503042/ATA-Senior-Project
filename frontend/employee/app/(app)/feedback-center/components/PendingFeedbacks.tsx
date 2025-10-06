'use client';
import { Card, CardBody, Button } from '@heroui/react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PendingFeedbacks({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" /> Pending Feedbacks
        </h2>
        {feedbacks?.length ? (
          <div className="space-y-3">
            {feedbacks.slice(0, 3).map(f => (
              <Link
                key={f.id}
                href={`/feedback/${f.id}`}
                className="block p-4 rounded bg-orange-50 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 transition"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200">{f.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(f.endDate).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No pending feedbacks</p>
        )}
      </CardBody>
    </Card>
  );
}
