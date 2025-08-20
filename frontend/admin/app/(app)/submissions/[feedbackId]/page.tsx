'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useMemo, useState, use } from 'react';

import DetailsPanel from './_components/DetailsPanel';
import Header from './_components/Header';
import SubmissionList from './_components/SubmissionList';
import SubmissionList from './_components/SubmissionList';
import Header from './_components/Header';
import DetailsPanel from './_components/DetailsPanel';

import { getSubmissionsByFeedback } from '@/services/submissionService';

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ feedbackId: string }>;
}) {
  const resolved = use(params);
  const feedbackId = resolved.feedbackId as string;

  const [items, setItems] = useState<any[]>([]);
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

('use client');

import { getSubmissionsByFeedback } from '@/services/submissionService';

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ feedbackId: string }>;
}) {
  const resolved = use(params);
  const feedbackId = resolved.feedbackId as string;
  const [items, setItems] = useState<any[]>([]);

  useMemo(() => {
    getSubmissionsByFeedback(feedbackId).then(res => setItems(res.items));
  }, [feedbackId]);
  const [selectedId, setSelectedId] = useState<string | null>(
    items[0]?.id ?? null,
  );
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
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <SubmissionList
            items={items}
            selectedId={selectedId ?? undefined}
            onSelect={id => setSelectedId(id)}
          />
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-8">
          <DetailsPanel item={current} />
        </div>
      </div>
    </div>
  );
}
