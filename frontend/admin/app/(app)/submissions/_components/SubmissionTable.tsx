'use client';

import type { SubmissionItem } from '@/types/submission';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';
import { memo } from 'react';

import SubmissionCellRenderer from './SubmissionCellRenderer';
import TopContent from './TopContent';

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
  onEdit?: (item: SubmissionItem) => void;
  onDelete?: (item: SubmissionItem) => void;
  onView?: (item: SubmissionItem) => void;
  onRefresh?: () => void;
  filterValue: string;
  selectedPrivacy: string[];
  selectedStatus: string[];
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onPrivacyChange: (privacy: string[]) => void;
  onStatusChange: (status: string[]) => void;
};

function SubmissionTable({
  items,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  filterValue,
  selectedPrivacy,
  selectedStatus,
  onSearchChange,
  onClear,
  onPrivacyChange,
  onStatusChange,
}: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredSubmissions = [...items];
    const query = filterValue.toLowerCase();

    if (filterValue) {
      filteredSubmissions = items.filter(
        submission =>
          submission.id.toString().includes(query) ||
          submission.feedbackTitle?.toLowerCase().includes(query) ||
          submission.submittedBy?.toString().includes(query)
      );
    }

    if (selectedPrivacy.length > 0) {
      filteredSubmissions = filteredSubmissions.filter(submission =>
        selectedPrivacy.includes(submission.privacyLevel)
      );
    }

    if (selectedStatus.length > 0) {
      filteredSubmissions = filteredSubmissions.filter(submission =>
        selectedStatus.includes(submission.status || 'pending')
      );
    }

    return filteredSubmissions;
  }, [items, filterValue, selectedPrivacy, selectedStatus]);

  const submissionItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const renderCell = useCallback(
    (submission: SubmissionItem, columnKey: Key) => (
      <SubmissionCellRenderer
        columnKey={String(columnKey)}
        item={submission}
        onDelete={onDelete}
        onEdit={onEdit}
        onView={onView}
      />
    ),
    [onEdit, onDelete, onView],
  );

  return (
    <div className="w-full h-[600px] flex flex-col">
      <Table
        aria-label="Submissions Table"
        topContent={
          <TopContent
            filterValue={filterValue}
            selectedPrivacy={selectedPrivacy}
            selectedStatus={selectedStatus}
            onClear={onClear}
            onRefresh={onRefresh || (() => {})}
            onPrivacyChange={onPrivacyChange}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
          />
        }
        topContentPlacement="outside"
        classNames={{
          wrapper: 'flex-1 overflow-auto',
          table: 'h-full',
          thead: 'bg-default-50 sticky top-0 z-10',
          th: 'text-default-600 font-semibold text-sm uppercase tracking-wider',
          td: 'py-4',
          tr: 'hover:bg-default-50 transition-colors',
        }}
      >
        <TableHeader columns={[...COLUMNS]}>
          {(column: (typeof COLUMNS)[number]) => (
            <TableColumn
              key={column.key}
              align={column.key === 'actions' ? 'center' : 'start'}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<span className="text-default-400">No submissions found</span>}
          items={submissionItems}
        >
          {(submission: SubmissionItem) => (
            <TableRow key={submission.id}>
              {columnKey => <TableCell>{renderCell(submission, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Fixed Pagination at Bottom */}
      <div className="flex w-full justify-center py-4 border-t border-default-200 bg-white">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

export default memo(SubmissionTable);
