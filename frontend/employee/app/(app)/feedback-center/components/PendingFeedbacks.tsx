'use client';
import { Card, CardBody, Button } from '@heroui/react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PendingFeedbacks({ feedbacks }: { feedbacks: any[] }) {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" /> Pending Feedbacks
        </h2>
        {feedbacks?.length ? (
          <div className="space-y-3">
            {feedbacks.slice(0, 3).map(f => (
              <Link
                key={f.id}
                href={`/feedback/${f.id}`}
                className="block p-4 rounded bg-orange-50  hover:bg-orange-100  transition"
              >
                <p className="font-medium text-gray-800 ">{f.title}</p>
                <p className="text-sm text-gray-500 ">Due: {new Date(f.endDate).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 ">No pending feedbacks</p>
        )}
      </CardBody>
    </Card>
  );
}
