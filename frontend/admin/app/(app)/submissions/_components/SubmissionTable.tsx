'use client';

import type { SubmissionItem } from '@/types/submission';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from '@heroui/react';
import Link from 'next/link';

import SubmissionCellRenderer from './SubmissionCellRenderer';

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'feedbackTitle', label: 'Feedback' },
  { key: 'submittedBy', label: 'Submitted By' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'submittedAt', label: 'Submitted At' },
  { key: 'status', label: 'Status' },
  { key: 'overallSentiment', label: 'Sentiment' },
  { key: 'actions', label: '' },
] as const;

type Props = {
  items: SubmissionItem[];
  loading?: boolean;
  onEdit?: (item: SubmissionItem) => void;
  onDelete?: (item: SubmissionItem) => void;
  onView?: (item: SubmissionItem) => void;
};

export default function SubmissionTable({
  items,
  loading,
  onEdit,
  onDelete,
  onView,
}: Props) {
  return (
    <Table
      isHeaderSticky
      removeWrapper
      aria-label="Submissions table"
      classNames={{
        wrapper: 'rounded-xl shadow-lg',
        thead: 'bg-default-100 dark:bg-default-50/90 backdrop-blur',
        th: 'text-default-500 font-semibold uppercase text-xs tracking-wide',
      }}
      shadow="sm"
    >
      <TableHeader columns={[...COLUMNS]}>
        {(column: (typeof COLUMNS)[number]) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent="No submissions found."
        isLoading={loading}
        items={items}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item: SubmissionItem) => (
          <TableRow
            key={item.id}
            className="hover:bg-default-100/60 transition-colors"
          >
            {columnKey => (
              <TableCell>
                {String(columnKey) === 'feedbackTitle' ? (
                  <Link
                    className="text-primary underline-offset-2 hover:underline"
                    href={`/submissions/${item.feedbackId}`}
                  >
                    <SubmissionCellRenderer
                      columnKey={String(columnKey)}
                      item={item}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onView={onView}
                    />
                  </Link>
                ) : (
                  <SubmissionCellRenderer
                    columnKey={String(columnKey)}
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onView={onView}
                  />
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
