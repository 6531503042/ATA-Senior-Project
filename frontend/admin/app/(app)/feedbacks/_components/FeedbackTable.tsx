'use client';

import { Button, Chip } from '@heroui/react';
import { EyeIcon, ReplyIcon, CheckCircle2Icon, FilterIcon, Trash2Icon, InboxIcon, ShieldIcon } from 'lucide-react';
import type { Feedback } from '@/types/feedback';
import { formatDate, statusMeta } from '@/types/feedback';

export default function FeedbackTable({
  items,
  loading,
  error,
  onView,
  onReply,
  onResolve,
  onReopen,
  onDelete,
}: {
  items: Feedback[];
  loading: boolean;
  error: string | null;
  onView: (f: Feedback) => void;
  onReply: (f: Feedback) => void;
  onResolve: (id: string) => void;
  onReopen: (id: string) => void;
  onDelete: (f: Feedback) => void;
}) {
  if (loading) {
    return <div className="flex items-center justify-center py-12 text-default-400">Loading feedback...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center py-12 text-red-500">Error: {error}</div>;
  }
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <InboxIcon className="w-10 h-10 text-default-300" />
        <div className="text-default-500">No feedback found</div>
      </div>
    );
  }

  return (
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
          {items.map((f) => {
            const chip = statusMeta[f.status];
            return (
              <tr key={f.id} className="border-b border-default-100 hover:bg-default-50/40">
                <td className="py-3 pr-4 align-top">
                  <div className="flex items-center gap-2">
                    {f.visibility === 'anonymous' ? (
                      <Chip size="sm" variant="flat" startContent={<ShieldIcon className="w-3 h-3" />}>Anonymous</Chip>
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
                    <Button size="sm" variant="light" startContent={<EyeIcon className="w-4 h-4" />} onPress={() => onView(f)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<ReplyIcon className="w-4 h-4" />}
                      onPress={() => onReply(f)}
                      isDisabled={f.visibility === 'anonymous'}
                    >
                      Reply
                    </Button>
                    {f.status !== 'resolved' ? (
                      <Button
                        size="sm"
                        color="success"
                        variant="shadow"
                        onPress={() => onResolve(f.id)}
                        startContent={<CheckCircle2Icon className="w-4 h-4" />}
                      >
                        Resolve
                      </Button>
                    ) : (
                      <Button size="sm" variant="flat" onPress={() => onReopen(f.id)} startContent={<FilterIcon className="w-4 h-4" />}>
                        Reopen
                      </Button>
                    )}
                    <Button size="sm" color="danger" variant="flat" startContent={<Trash2Icon className="w-4 h-4" />} onPress={() => onDelete(f)}>
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
  );
}