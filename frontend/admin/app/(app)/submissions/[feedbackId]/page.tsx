'use client';

import { use, useEffect, useMemo, useState } from 'react';

import DetailsPanel from './_components/DetailsPanel';
import Header from './_components/Header';
import SubmissionList from './_components/SubmissionList';

import { apiRequest } from '@/utils/api';

export interface Submission {
  id: string;
  feedbackId: string;
  userId: string;
  answers: any[];
  submittedAt: string;
  status: string;
}

export interface SubmissionsResponse {
  items: Submission[];
  total: number;
  page: number;
  limit: number;
}

async function getSubmissionsByFeedback(feedbackId: string): Promise<SubmissionsResponse> {
  try {
    const response = await apiRequest<SubmissionsResponse>(`/api/feedbacks/${feedbackId}/submissions`, 'GET');
    
    if (response.data) {
      return response.data;
    }
    
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  }
}

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ feedbackId: string }>;
}) {
  const resolved = use(params);
  const feedbackId = resolved.feedbackId as string;

  const [items, setItems] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getSubmissionsByFeedback(feedbackId).then(res => {
      setItems(res.items);
      setSelectedId(res.items[0]?.id ?? null);
    });
  }, [feedbackId]);

  const current = useMemo(
    () => items.find(i => i.id === selectedId) || null,
    [items, selectedId],
  );

  return (
    <div className="space-y-6">
      <Header
        title="Feedback Analysis"
        total={items.length}
        onBack={() => history.back()}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SubmissionList
            items={items}
            selectedId={selectedId ?? undefined}
            onSelect={id => setSelectedId(id)}
          />
        </div>
        <div className="lg:col-span-2">
          <DetailsPanel current={current} />
        </div>
      </div>
    </div>
  );
}
