import { Suspense } from 'react';
import FeedbackForm from './FeedbackForm';
import React from 'react';

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
            <p className="text-sm text-gray-500">Loading your feedback form...</p>
          </div>
        </div>
      }
    >
      <FeedbackForm id={id} />
    </Suspense>
  );
}
