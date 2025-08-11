'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
} from '@heroui/react';
import {
  MessageSquareTextIcon as FeedbackIcon,
  PlusIcon,
  InboxIcon,
  CheckCircle2Icon,
  FilterIcon,
  Trash2Icon,
  EyeIcon,
  ReplyIcon,
  DownloadIcon,
  ShieldIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';

// --- Types (inline for portability; move to @/types/feedback later) ---
export type FeedbackStatus = 'unread' | 'in_review' | 'resolved';
export type FeedbackVisibility = 'anonymous' | 'identified';

export interface Feedback {
  id: string;
  subject: string;
  message: string;
  projectName: string;
  category?: string;
  status: FeedbackStatus;
  visibility: FeedbackVisibility; // 'anonymous' means hide reporter info
  createdAt: string; // ISO
  reporter?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

// --- Mock seed (replace with data from your API/hook) ---
const seed: Feedback[] = [
  {
    id: 'fbk_01',
    subject: 'Login form confusing',
    message: 'The login button is not obvious on mobile. Consider larger primary CTA.',
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

// Utility formatters
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusToChip = (status: FeedbackStatus) => {
  const map: Record<FeedbackStatus, { label: string; color: 'default' | 'warning' | 'success' }> = {
    unread: { label: 'Unread', color: 'warning' },
    in_review: { label: 'In Review', color: 'default' },
    resolved: { label: 'Resolved', color: 'success' },
  };
  return map[status];
};

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
    const unread = feedbacks.filter((f) => f.status === 'unread').length;
    const resolved = feedbacks.filter((f) => f.status === 'resolved').length;
    const inReview = feedbacks.filter((f) => f.status === 'in_review').length;
    return { total, unread, inReview, resolved };
  }, [feedbacks]);

  const projectOptions = useMemo(() => {
    const s = new Set<string>();
    feedbacks.forEach((f) => s.add(f.projectName));
    return Array.from(s);
  }, [feedbacks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feedbacks.filter((f) => {
      const matchesQ = !q ||
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
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'resolved' } : f)));
  };

  const moveToReview = (id: string) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'in_review' } : f)));
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
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
    const rows = filtered.map((f) => [
      f.id,
      f.subject.replaceAll('\n', ' '),
      f.message.replaceAll('\n', ' '),
      f.projectName,
      f.category ?? '',
      f.status,
      f.visibility,
      f.createdAt,
      f.reporter?.name ?? '',
      f.reporter?.email ?? '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader description="Collect, review, and resolve confidential feedback" icon={<FeedbackIcon />} />

      {/* Title + Actions */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-violet-50 via-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Feedbacks
            </h1>
            <p className="text-default-600 mt-1">Confidential reporting with status tracking and responses</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="flat" startContent={<DownloadIcon className="w-4 h-4" />} onPress={exportCSV} className="w-full sm:w-auto">
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { title: 'Total', value: stats.total, icon: FeedbackIcon, gradient: 'from-white to-slate-50' },
            { title: 'Unread', value: stats.unread, icon: InboxIcon, gradient: 'from-amber-50 to-yellow-50' },
            { title: 'In Review', value: stats.inReview, icon: FilterIcon, gradient: 'from-blue-50 to-indigo-50' },
            { title: 'Resolved', value: stats.resolved, icon: CheckCircle2Icon, gradient: 'from-emerald-50 to-green-50' },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group">
              <CardBody className="p-6 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">{s.title}</p>
                    <p className="text-3xl font-bold text-default-900">{s.value}</p>
                    <p className="text-xs text-default-400 mt-1">{s.title === 'Total' ? 'All feedback items' : s.title}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                    <s.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardBody className="gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Input
                  label="Search"
                  placeholder="Search subject, message, project, category"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  startContent={<FilterIcon className="w-4 h-4 text-default-400" />}
                />
              </div>
              <div>
                <label className="text-xs text-default-500 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-xl border-default-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-default-500 block mb-1">Project</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full rounded-xl border-default-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none"
                >
                  <option value="all">All projects</option>
                  {projectOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">Feedback List</h3>
              <p className="text-sm text-default-600">Browse and manage all incoming feedback</p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-default-400">Loading feedback...</div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-red-500">Error: {error}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <InboxIcon className="w-10 h-10 text-default-300" />
                <div className="text-default-500">No feedback found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-default-500 border-b border-default-200">
                    <tr>
                      <th className="py-3 pr-4">Subject</th>
                      <th className="py-3 pr-4">Project</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Submitted</th>
                      <th className="py-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => {
                      const chip = statusToChip(f.status);
                      return (
                        <tr key={f.id} className="border-b border-default-100 hover:bg-default-50/40">
                          <td className="py-3 pr-4 align-top">
                            <div className="flex items-center gap-2">
                              {f.visibility === 'anonymous' ? (
                                <Chip size="sm" variant="flat" startContent={<ShieldIcon className="w-3 h-3" />}>
                                  Anonymous
                                </Chip>
                              ) : null}
                              <div className="font-medium text-default-900">{f.subject}</div>
                            </div>
                            <div className="text-default-500 text-xs line-clamp-1 mt-1">{f.message}</div>
                          </td>
                          <td className="py-3 pr-4 align-top">{f.projectName}</td>
                          <td className="py-3 pr-4 align-top">{f.category ?? '-'}</td>
                          <td className="py-3 pr-4 align-top">
                            <Chip size="sm" color={chip.color} variant="flat">
                              {chip.label}
                            </Chip>
                          </td>
                          <td className="py-3 pr-4 align-top text-default-500">{formatDate(f.createdAt)}</td>
                          <td className="py-3 pr-0 align-top">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="light" startContent={<EyeIcon className="w-4 h-4" />} onPress={() => setViewing(f)}>
                                View
                              </Button>
                              <Button size="sm" variant="flat" startContent={<ReplyIcon className="w-4 h-4" />} onPress={() => setReplyTo(f)}
                                isDisabled={f.visibility === 'anonymous'}
                              >
                                Reply
                              </Button>
                              {f.status !== 'resolved' ? (
                                <Button size="sm" color="success" variant="shadow" onPress={() => markResolved(f.id)} startContent={<CheckCircle2Icon className="w-4 h-4" />}>
                                  Resolve
                                </Button>
                              ) : (
                                <Button size="sm" variant="flat" onPress={() => moveToReview(f.id)} startContent={<FilterIcon className="w-4 h-4" />}>
                                  Reopen
                                </Button>
                              )}
                              <Button size="sm" color="danger" variant="flat" startContent={<Trash2Icon className="w-4 h-4" />} onPress={() => setToDelete(f)}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Details modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} size="lg" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{viewing?.subject}</ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Chip size="sm" variant="flat" startContent={<FeedbackIcon className="w-3 h-3" />}> {viewing?.projectName}</Chip>
                {viewing?.category ? <Chip size="sm" variant="flat">{viewing?.category}</Chip> : null}
                {viewing?.visibility === 'anonymous' ? (
                  <Chip size="sm" variant="flat" startContent={<ShieldIcon className="w-3 h-3" />}>Anonymous</Chip>
                ) : (
                  <Chip size="sm" variant="flat">Identified</Chip>
                )}
                {viewing ? (
                  <Chip size="sm" variant="flat">{statusToChip(viewing.status).label}</Chip>
                ) : null}
              </div>
              <div className="text-xs text-default-500">Submitted: {viewing ? formatDate(viewing.createdAt) : '-'}</div>
              <div className="rounded-xl border border-default-200 bg-default-50 p-4 text-default-800 whitespace-pre-wrap">
                {viewing?.message}
              </div>
              {viewing?.visibility === 'identified' && viewing?.reporter ? (
                <div className="text-sm text-default-600">
                  <div className="font-medium mb-1">Reporter</div>
                  <div>Name: {viewing.reporter.name || '-'}</div>
                  <div>Email: {viewing.reporter.email || '-'}</div>
                </div>
              ) : (
                <div className="text-xs text-default-500 flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4" /> Reporter identity hidden (confidential)
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center gap-2">
              <Button variant="light" onPress={() => setViewing(null)}>Close</Button>
              {viewing?.visibility === 'identified' ? (
                <Button startContent={<ReplyIcon className="w-4 h-4" />} onPress={() => { setReplyTo(viewing); setViewing(null); }}>Reply</Button>
              ) : null}
              {viewing && viewing.status !== 'resolved' ? (
                <Button color="success" startContent={<CheckCircle2Icon className="w-4 h-4" />} onPress={() => { markResolved(viewing.id); setViewing(null); }}>
                  Mark Resolved
                </Button>
              ) : null}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reply modal (disabled if anonymous) */}
      <Modal isOpen={!!replyTo} onClose={() => setReplyTo(null)} size="md">
        <ModalContent>
          <ModalHeader>Reply to feedback</ModalHeader>
          <ModalBody>
            {replyTo?.visibility === 'anonymous' ? (
              <div className="text-default-500 text-sm">Cannot reply: reporter is anonymous.</div>
            ) : (
              <ReplyForm onDone={() => setReplyTo(null)} to={replyTo} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setReplyTo(null)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  );
}

// --- Small Reply form component ---
function ReplyForm({ to, onDone }: { to: Feedback | null; onDone: () => void }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = (to?.visibility === 'identified') && message.trim().length > 0;

  const send = async () => {
    if (!to || !canSend) return;
    try {
      setSending(true);
      // TODO: POST to your notifications/email service here
      await new Promise((r) => setTimeout(r, 700));
      onDone();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-default-600">
        To: <span className="font-medium">{to?.reporter?.name || to?.reporter?.email || 'Reporter'}</span>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Write your reply..."
        className="w-full rounded-xl border border-default-200 bg-white p-3 text-sm focus:outline-none"
      />
      <div className="flex justify-end">
        <Button isDisabled={!canSend} isLoading={sending} startContent={<ReplyIcon className="w-4 h-4" />} onPress={send}>
          Send reply
        </Button>
      </div>
    </div>
  );
}
