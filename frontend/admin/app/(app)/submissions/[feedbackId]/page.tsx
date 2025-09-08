'use client';

import { use, useEffect, useMemo, useState } from 'react';

import DetailsPanel from './_components/DetailsPanel';
import Header from './_components/Header';
import SubmissionList from './_components/SubmissionList';
import { Card, CardBody } from '@heroui/react';
import type { SubmitDto } from '@/types/submission';
import { useSubmissionsByFeedback } from '@/hooks/useSubmissions';

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ feedbackId: string }>;
}) {
  const resolved = use(params);
  const feedbackId = resolved.feedbackId as string;

  const { data: fetched, loading } = useSubmissionsByFeedback(Number(feedbackId));
  const [items, setItems] = useState<SubmitDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const list = Array.isArray(fetched) ? fetched : [];
    setItems(list);
    setSelectedId(list[0] ? String(list[0].id) : null);
  }, [fetched]);

  const current = useMemo(
    () => items.find(i => String(i.id) === selectedId) || null,
    [items, selectedId],
  );

  return (
    <div className="space-y-6">
      <Header title="Submissions" total={items.length} onBack={() => history.back()} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Submission selector */}
        <div className="lg:col-span-1">
          <SubmissionList items={items} selectedId={selectedId ?? undefined} onSelect={id => setSelectedId(id)} />
        </div>
        {/* Right: Unified details + answers */}
        <div className="lg:col-span-2">
          <DetailsPanel item={current as any} />
          {/* Answers list */}
          <Card className="mt-4 bg-white dark:bg-default-50 rounded-2xl border-0 shadow-xl" shadow="sm">
            <CardBody className="space-y-3">
              <h3 className="text-sm font-semibold text-default-600">Answers</h3>
              {current ? (
                <AnswersBlock feedbackId={current.feedbackId} submissionId={current.id} />
              ) : (
                <div className="text-default-500 text-sm">Select a submission to view answers</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Fetch question texts and submission detail to render Q&A
function AnswersBlock({ feedbackId, submissionId }: { feedbackId: number; submissionId: number }) {
  const [qa, setQa] = useState<{ questionId: number; question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Load feedback questionIds
        const feedback = await apiRequest<any>(`/api/feedbacks/${feedbackId}`, 'GET');
        const ids: number[] = feedback.data?.questionIds || [];
        // Load submission detail
        const sub = await apiRequest<any>(`/api/submits/${submissionId}`, 'GET');
        const responses: Record<number, string> = sub.data?.responses || {};
        // Fetch questions
        const questions = await Promise.all(
          ids.map(id => apiRequest<any>(`/api/questions/${id}`, 'GET').then(r => r.data))
        );
        const qMap = new Map<number, string>();
        for (const q of questions) qMap.set(q.id, q.text);
        const rows = Object.entries(responses).map(([k, v]) => ({
          questionId: Number(k),
          question: qMap.get(Number(k)) || `Question #${k}`,
          answer: String(v ?? ''),
        }));
        if (mounted) setQa(rows);
      } catch {
        if (mounted) setQa([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [feedbackId, submissionId]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-lg border border-default-200 bg-default-50 p-3 animate-pulse">
            <div className="h-3 w-40 bg-default-200 rounded" />
            <div className="h-4 w-3/4 bg-default-300 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }
  if (qa.length === 0) {
    return <div className="text-default-400 text-sm">No answers</div>;
  }
  return (
    <div className="space-y-3">
      {qa.map(row => (
        <div key={row.questionId} className="rounded-xl border border-default-200 bg-white dark:bg-default-50 p-3 shadow-sm">
          <div className="text-xs font-semibold text-default-600 tracking-wide">{row.question}</div>
          <div className="mt-2">
            {/* Emphasize answer */}
            <div className="inline-block px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 text-default-900 border border-indigo-100 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-900">
              <span className="font-medium">{row.answer || '—'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
