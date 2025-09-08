'use client';

import type { SubmissionItem } from '@/types/submission';

import { useMemo, useState, useEffect } from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { Loader2 } from 'lucide-react';

import TopContent from './_components/TopContent';
import BottomContent from './_components/BottomContent';
import SubmissionTable from './_components/SubmissionTable';
import SubmissionsDetailModal from './_components/SubmissionsDetailModal';
import SubmissionList from './[feedbackId]/_components/SubmissionList';
import DetailsPanel from './[feedbackId]/_components/DetailsPanel';
import { apiRequest } from '@/utils/api';
import FeedbackSelector from './_components/FeedbackSelector';
import SubmissionMetrics from './_components/SubmissionMetrics';
import SatisfactionOverview from './_components/SatisfactionOverview';
// Removed AI analysis components

import { useSubmissions, fetchSubmissionStats } from '@/hooks/useSubmissions';

export default function SubmissionsPage() {
  const {
    items,
    allItems,
    stats,
    loading,
    filters,
    pagination,
    setPagination,
    setQuery,
    setPrivacy,
    refresh,
  } = useSubmissions();

  const [detail, setDetail] = useState<any | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<
    string | undefined
  >(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStats, setBackendStats] = useState(stats);
  const [listItems, setListItems] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [fbOptions, setFbOptions] = useState<{ id: string; title: string }[]>([]);

  // Fetch backend stats on component mount
  useEffect(() => {
    const loadBackendStats = async () => {
      try {
        const backendStatsData = await fetchSubmissionStats();
        setBackendStats(backendStatsData);
      } catch (error) {
        console.error('Failed to load backend stats:', error);
      }
    };
    loadBackendStats();
  }, []);

  const feedbackOptions = useMemo(() => {
    if (fbOptions.length > 0) return fbOptions;
    const map = new Map<string, string>();
    (allItems || []).forEach(it => {
      const key = String(it.feedbackId);
      if (!map.has(key)) map.set(key, it.feedbackTitle || `Feedback #${key}`);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title: title || `Feedback #${id}` }));
  }, [allItems, fbOptions]);

  // Auto-select first feedback and load its submissions
  useEffect(() => {
    if (!selectedFeedbackId && feedbackOptions.length > 0) {
      setSelectedFeedbackId(feedbackOptions[0].id);
    }
  }, [feedbackOptions, selectedFeedbackId]);

  // If no options derived from submissions, fetch feedbacks list for selector
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (fbOptions.length > 0) return;
      try {
        const res = await apiRequest<any>('/api/feedbacks', 'GET');
        const page = res.data;
        const content = Array.isArray(page?.content) ? page.content : [];
        const options = content.map((f: any) => ({ id: String(f.id), title: f.title || `Feedback #${f.id}` }));
        if (mounted && options.length > 0) setFbOptions(options);
      } catch {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, [fbOptions.length]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!selectedFeedbackId) {
        setListItems([]);
        return;
      }
      setListLoading(true);
      try {
        const res = await apiRequest<any>(`/api/submits/feedback/${selectedFeedbackId}`, 'GET');
        const items = Array.isArray(res.data?.content) ? res.data.content : [];
        if (mounted) setListItems(items);
        if (mounted && items.length > 0 && !detail) {
          setDetail(items[0]);
        }
      } catch (e) {
        if (mounted) setListItems([]);
      } finally {
        if (mounted) setListLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [selectedFeedbackId]);

  const sentimentCounts = useMemo(() => {
    const filtered = selectedFeedbackId
      ? (allItems || []).filter(i => String(i.feedbackId) === selectedFeedbackId)
      : (allItems || []);
    const init = { positive: 0, neutral: 0, negative: 0 } as Record<
      string,
      number
    >;

    return filtered.reduce((acc, it) => {
      if (it.overallSentiment)
        acc[it.overallSentiment] = (acc[it.overallSentiment] || 0) + 1;

      return acc;
    }, init);
  }, [allItems, selectedFeedbackId]);

  const satisfactionRate = useMemo(() => {
    const total = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);

    if (total === 0) return 0;

    return Math.round(((sentimentCounts.positive || 0) / total) * 100);
  }, [sentimentCounts]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
        <p className="text-default-500 text-sm">Review and manage feedback submissions</p>
      </div>

      {/* Top stats section */}
      {(
        <>
          <SubmissionMetrics
            analyzed={backendStats.analyzed}
            pending={backendStats.pending}
            total={backendStats.total}
          />
        </>
      )}

      <div className="space-y-4">
        <TopContent
          privacy={filters.privacy}
          query={filters.query}
          // status filter removed
          onClear={() => setQuery('')}
          onPrivacyChange={setPrivacy}
          onQueryChange={setQuery}
          onRefresh={async () => {
            try {
              setIsRefreshing(true);
              await refresh();
              // Also refresh backend stats
              const backendStatsData = await fetchSubmissionStats();
              setBackendStats(backendStatsData);
            } finally {
              setIsRefreshing(false);
            }
          }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left list: choose feedback (filters submissions list) */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-default-50" shadow="sm">
              <CardBody className="space-y-3">
                <FeedbackSelector
                  options={feedbackOptions}
                  value={selectedFeedbackId}
                  onChange={setSelectedFeedbackId as (v: string) => void}
                />
                <SubmissionList
                  items={listItems as any}
                  selectedId={detail ? String(detail.id) : undefined}
                  onSelect={(id: string) => {
                    const chosen = (listItems as any[]).find(i => String(i.id) === id) || null;
                    setDetail(chosen || null);
                  }}
                />
              </CardBody>
            </Card>
          </div>
          {/* Right panel: details + table (or answers if selected) */}
          <div className="lg:col-span-2 space-y-4">
            {detail ? (
              <Card className="bg-white dark:bg-default-50 rounded-2xl border-0 shadow-xl" shadow="sm">
                <CardBody className="space-y-3 p-5">
                  <DetailsPanel item={detail as any} />
                  <Card className="mt-2 rounded-xl border-0" shadow="none">
                    <CardBody className="space-y-3 p-4">
                      <h3 className="text-sm font-semibold text-default-600">Answers</h3>
                      <InlineAnswers feedbackId={Number(detail.feedbackId)} submissionId={Number(detail.id)} />
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            ) : null}
            <div className="rounded-2xl bg-white dark:bg-default-50 p-3 sm:p-4 shadow-xl">
              <SubmissionTable
                items={items}
                loading={loading}
                onDelete={() => {}}
                onEdit={() => {}}
                onView={item => setDetail(item)}
              />
              <BottomContent
                page={pagination.page}
                rowsPerPage={pagination.rowsPerPage}
                total={allItems.length}
                onPageChange={p =>
                  setPagination(prev => ({ ...prev, page: p }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} shadow="sm">
              <CardBody className="h-24 animate-pulse bg-default-100" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white dark:bg-default-50 p-3 sm:p-4 shadow-lg">
          <SubmissionTable
            items={items}
            loading={loading}
            onDelete={() => {}}
            onEdit={() => {}}
            onView={item => setDetail(item)}
          />
          <BottomContent
            page={pagination.page}
            rowsPerPage={pagination.rowsPerPage}
            total={allItems.length}
            onPageChange={p =>
              setPagination(prev => ({ ...prev, page: p }))
            }
          />
        </div>
      )}

      {/* Keep modal for quick view; main flow is inline right panel */}
      <SubmissionsDetailModal isOpen={false} item={null} onClose={() => {}} />

      {isRefreshing && (
        <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-default-50 px-4 py-3 shadow-lg">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Refreshing data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function InlineAnswers({ feedbackId, submissionId }: { feedbackId: number; submissionId: number }) {
  type QDetail = { id: number; text: string; questionType?: string; choices?: string[] };
  const [qa, setQa] = useState<{ id: number; q: string; a: string; type?: string; choices?: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [fbRes, subRes] = await Promise.all([
          apiRequest<any>(`/api/feedbacks/${feedbackId}`, 'GET'),
          apiRequest<any>(`/api/submits/${submissionId}`, 'GET'),
        ]);
        const responses: Record<number, string> = subRes.data?.responses || {};
        const responseIds = Object.keys(responses).map(Number);
        const fbIds: number[] = fbRes.data?.questionIds || [];
        const ids: number[] = Array.from(new Set([...(fbIds || []), ...responseIds]));
        const questions: QDetail[] = ids.length > 0
          ? await Promise.all(
              ids.map(id =>
                apiRequest<any>(`/api/questions/${id}`, 'GET')
                  .then(r => ({ id: r.data?.id ?? id, text: r.data?.text ?? `Question #${id}`, questionType: r.data?.questionType, choices: r.data?.choices }))
                  .catch(() => ({ id, text: `Question #${id}` } as QDetail)),
              ),
            )
          : [];
        const map = new Map<number, QDetail>();
        for (const q of questions) map.set(q.id, q);
        const rows = ids.map(id => {
          const q = map.get(id);
          return {
            id,
            q: q?.text || `Question #${id}`,
            a: String((responses as any)[id] ?? ''),
            type: q?.questionType,
            choices: q?.choices,
          };
        });
        if (mounted) setQa(rows);
      } catch {
        if (mounted) setQa([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
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
  const renderAnswer = (row: { id: number; q: string; a: string; type?: string; choices?: string[] }) => {
    const type = row.type || 'TEXT';
    const a = row.a ?? '';
    switch (type) {
      case 'MULTIPLE_CHOICE': {
        const chips = a.split(/[,;]\s*/).filter(Boolean);
        return (
          <div className="flex flex-wrap gap-2 mt-1">
            {chips.length > 0 ? chips.map((c, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full text-xs bg-primary-50 text-primary border border-primary/20">{c}</span>
            )) : <span className="text-default-400 text-sm">No selection</span>}
          </div>
        );
      }
      case 'BOOLEAN': {
        const isYes = String(a).toLowerCase() === 'true' || a === 'YES' || a === 'Yes';
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${isYes ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>{isYes ? 'Yes' : 'No'}</span>
        );
      }
      case 'RATING': {
        const val = Number(a);
        return (
          <div className="mt-1 flex items-center gap-2 text-sm text-default-900">
            <div className="h-2 w-32 bg-default-200 rounded">
              <div className="h-2 bg-amber-500 rounded" style={{ width: `${Math.min(100, Math.max(0, (val / 5) * 100))}%` }} />
            </div>
            <span>{isNaN(val) ? a : `${val}/5`}</span>
          </div>
        );
      }
      default: {
        return <div className="mt-1 p-2 rounded-md bg-default-100 text-sm text-default-900 break-words">{a || <span className="text-default-400">No answer</span>}</div>;
      }
    }
  };

  return (
    <div className="space-y-3">
      {qa.map(row => (
        <div key={row.id} className="rounded-xl border border-default-200 bg-white dark:bg-default-50 p-3">
          <div className="text-xs font-medium text-default-500">{row.q}</div>
          {renderAnswer(row)}
        </div>
      ))}
    </div>
  );
}
