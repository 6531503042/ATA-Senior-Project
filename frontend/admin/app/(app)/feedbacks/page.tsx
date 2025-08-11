'use client';

import { useMemo, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import {
  MessageSquareTextIcon as FeedbackIcon,
  DownloadIcon,
  PlusIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import FeedbackStats from './_components/FeedbackStats';
import FeedbackFilters from './_components/FeedbackFilters';
import FeedbackTable from './_components/FeedbackTable';
import FeedbackDetailsModal from './_components/FeedbackDetailsModal';
import FeedbackReplyModal from './_components/FeedbackReplyModal';
import type {
  Feedback,
  FeedbackStatus,
  CreateFeedbackRequest,
} from '@/types/feedback';
import FeedbackCreateModal from './_components/FeedbackCreateModal';

// --- Mock seed (replace with data from your API/hook) ---
const seed: Feedback[] = [
  {
    id: 'fbk_01',
    subject: 'Login form confusing',
    message:
      'The login button is not obvious on mobile. Consider larger primary CTA.',
    projectName: 'ATA IT Feedback System',
    category: 'UX',
    status: 'unread',
    visibility: 'anonymous',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    reporter: null,
  },
  {
    id: 'fbk_02',
    subject: 'API response delay on /admin/project',
    message: 'Takes ~5s to load. Maybe add caching or skeletons.',
    projectName: 'ATA IT Feedback System',
    category: 'Performance',
    status: 'in_review',
    visibility: 'identified',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    reporter: { name: 'Internal QA', email: 'qa@example.com' },
  },
  {
    id: 'fbk_03',
    subject: 'Great job on dark mode',
    message: 'Loving the new dark theme. Thanks!',
    projectName: 'ATA IT Feedback System',
    category: 'Kudos',
    status: 'resolved',
    visibility: 'anonymous',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    reporter: null,
  },
];

export default function FeedbacksPage() {
  // Data state (swap to your hook later)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(seed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters/search
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | FeedbackStatus>('all');
  const [project, setProject] = useState<'all' | string>('all');

  // Modals state
  const [viewing, setViewing] = useState<Feedback | null>(null);
  const [replyTo, setReplyTo] = useState<Feedback | null>(null);
  const [toDelete, setToDelete] = useState<Feedback | null>(null);

  // Derived stats
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const unread = feedbacks.filter(f => f.status === 'unread').length;
    const resolved = feedbacks.filter(f => f.status === 'resolved').length;
    const inReview = feedbacks.filter(f => f.status === 'in_review').length;
    return { total, unread, inReview, resolved };
  }, [feedbacks]);

  const projectOptions = useMemo(() => {
    const s = new Set<string>();
    feedbacks.forEach(f => s.add(f.projectName));
    return Array.from(s);
  }, [feedbacks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feedbacks.filter(f => {
      const matchesQ =
        !q ||
        f.subject.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q) ||
        f.projectName.toLowerCase().includes(q) ||
        (f.category?.toLowerCase().includes(q) ?? false);
      const matchesStatus = status === 'all' || f.status === status;
      const matchesProject = project === 'all' || f.projectName === project;
      return matchesQ && matchesStatus && matchesProject;
    });
  }, [feedbacks, query, status, project]);

  // Actions (wire these to your API later)
  const markResolved = (id: string) => {
    setFeedbacks(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'resolved' } : f)),
    );
  };

  const moveToReview = (id: string) => {
    setFeedbacks(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'in_review' } : f)),
    );
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const exportCSV = () => {
    const headers = [
      'id',
      'subject',
      'message',
      'projectName',
      'category',
      'status',
      'visibility',
      'createdAt',
      'reporter.name',
      'reporter.email',
    ];

    const sanitize = (v: unknown) =>
      String(v ?? '')
        .replace(/\r?\n/g, ' ') // collapse newlines
        .replace(/"/g, '""'); // escape quotes

    const rows = filtered.map(f => [
      f.id,
      f.subject,
      f.message,
      f.projectName,
      f.category ?? '',
      f.status,
      f.visibility,
      f.createdAt,
      f.reporter?.name ?? '',
      f.reporter?.email ?? '',
    ]);

    const csv = [
      headers.join(','), // header row
      ...rows.map(r => r.map(v => `"${sanitize(v)}"`).join(',')),
    ].join('\r\n'); // Windows-friendly EOL

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const handleCreateFeedback = (data: CreateFeedbackRequest) => {
    setFeedbacks(prev => [
      {
        id: `fbk_${Date.now()}`,
        subject: data.subject,
        message: data.message,
        projectName: data.projectName,
        category: data.category,
        status: 'unread',
        visibility: data.visibility,
        reporter: data.reporter ?? null,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setIsCreateOpen(false);
  };

  return (
    <>
      <PageHeader
        description="Collect, review, and resolve confidential feedback"
        icon={<FeedbackIcon />}
      />

      <div className="space-y-8">
        {/* Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-violet-50 via-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Feedbacks
            </h1>
            <p className="text-default-600 mt-1">
              Confidential reporting with status tracking and responses
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                color="primary"
                variant="shadow"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => setIsCreateOpen(true)}
                className="w-full sm:w-auto font-semibold"
              >
                Create Feedback
              </Button>

              <Button
                variant="flat"
                startContent={<DownloadIcon className="w-4 h-4" />}
                onPress={exportCSV}
                className="w-full sm:w-auto"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <FeedbackStats stats={stats} />

        {/* Filters */}
        <FeedbackFilters
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={v => setStatus(v)}
          project={project}
          onProjectChange={setProject}
          projectOptions={projectOptions}
        />

        {/* Table */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">
                Feedback List
              </h3>
              <p className="text-sm text-default-600">
                Browse and manage all incoming feedback
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <FeedbackTable
              items={filtered}
              loading={loading}
              error={error}
              onView={f => setViewing(f)}
              onReply={f => setReplyTo(f)}
              onResolve={id => markResolved(id)}
              onReopen={id => moveToReview(id)}
              onDelete={f => setToDelete(f)}
            />
          </CardBody>
        </Card>
      </div>

      {/* Details modal */}
      <FeedbackDetailsModal
        isOpen={!!viewing}
        feedback={viewing || undefined}
        onClose={() => setViewing(null)}
        onResolve={id => {
          markResolved(id);
          setViewing(null);
        }}
        onReply={f => {
          setViewing(null);
          setReplyTo(f);
        }}
      />

      {/* Reply modal */}
      <FeedbackReplyModal
        isOpen={!!replyTo}
        to={replyTo || undefined}
        onClose={() => setReplyTo(null)}
        onSent={() => setReplyTo(null)}
      />

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteFeedback(toDelete.id);
          setToDelete(null);
        }}
        title="Delete Feedback"
        body={`Are you sure you want to delete \"${toDelete?.subject}\"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        cancelText="Cancel"
        cancelColor="primary"
      />
      <FeedbackCreateModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  onSubmit={handleCreateFeedback}
  projectOptions={projectOptions}
/>

    </>
  );
}
