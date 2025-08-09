'use client';

import type { SubmissionItem } from '@/types/submission';

import { useMemo, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { Loader2 } from 'lucide-react';

import TopContent from './_components/TopContent';
import BottomContent from './_components/BottomContent';
import SubmissionTable from './_components/SubmissionTable';
import SubmissionsDetailModal from './_components/SubmissionsDetailModal';
import FeedbackSelector from './_components/FeedbackSelector';
import SubmissionMetrics from './_components/SubmissionMetrics';
import SatisfactionOverview from './_components/SatisfactionOverview';
import AIInsightsCard from './_components/AIInsightsCard';
import SubmissionAnalysis from './_components/SubmissionAnalysis';
import SubmissionResponseAnalysis from './_components/SubmissionResponseAnalysis';

import { useSubmissions } from '@/hooks/useSubmissions';

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
    setStatus,
    refresh,
  } = useSubmissions();

  const [detail, setDetail] = useState<SubmissionItem | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<
    string | undefined
  >(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const feedbackOptions = useMemo(() => {
    const map = new Map<string, string>();

    allItems.forEach(it => {
      if (!map.has(it.feedbackId)) map.set(it.feedbackId, it.feedbackTitle);
    });

    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [allItems]);

  const sentimentCounts = useMemo(() => {
    const filtered = selectedFeedbackId
      ? allItems.filter(i => i.feedbackId === selectedFeedbackId)
      : allItems;
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
        <h1 className="text-2xl font-semibold">Submissions</h1>
        <p className="text-default-500 text-sm">
          Review and manage feedback submissions
        </p>
      </div>

      <div className="space-y-4">
        <TopContent
          privacy={filters.privacy}
          query={filters.query}
          status={filters.status}
          onClear={() => setQuery('')}
          onPrivacyChange={setPrivacy}
          onQueryChange={setQuery}
          onRefresh={async () => {
            try {
              setIsRefreshing(true);
              await refresh();
            } finally {
              setIsRefreshing(false);
            }
          }}
          onStatusChange={setStatus}
        />
        <div className="flex items-center gap-3">
          <FeedbackSelector
            options={feedbackOptions}
            value={selectedFeedbackId}
            onChange={setSelectedFeedbackId as (v: string) => void}
          />
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
        <>
          <SubmissionMetrics
            analyzed={stats.analyzed}
            pending={stats.pending}
            total={stats.total}
          />

          <Tabs
            aria-label="Submissions Tabs"
            color="primary"
            variant="underlined"
          >
            <Tab key="overview" title="Overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <AIInsightsCard />
                </div>
                <div className="lg:col-span-1">
                  <SatisfactionOverview
                    satisfactionRate={satisfactionRate}
                    totalSubmissions={allItems.length}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2">
                  <SubmissionAnalysis />
                </div>
                <div className="lg:col-span-1">
                  <SubmissionResponseAnalysis />
                </div>
              </div>
            </Tab>
            <Tab key="insights" title="Insights">
              <AIInsightsCard />
            </Tab>
            <Tab key="submissions" title="Submissions">
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
            </Tab>
          </Tabs>
        </>
      )}

      <SubmissionsDetailModal
        isOpen={!!detail}
        item={detail}
        onClose={() => setDetail(null)}
      />

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
