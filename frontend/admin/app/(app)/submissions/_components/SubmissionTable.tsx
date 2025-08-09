"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react";
import Link from "next/link";
import type { SubmissionItem } from "@/types/submission";
import SubmissionCellRenderer from "./SubmissionCellRenderer";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "feedbackTitle", label: "Feedback" },
  { key: "submittedBy", label: "Submitted By" },
  { key: "privacy", label: "Privacy" },
  { key: "submittedAt", label: "Submitted At" },
  { key: "status", label: "Status" },
  { key: "overallSentiment", label: "Sentiment" },
  { key: "actions", label: "" },
] as const;

type Props = {
  items: SubmissionItem[];
  loading?: boolean;
  onEdit?: (item: SubmissionItem) => void;
  onDelete?: (item: SubmissionItem) => void;
};

export default function SubmissionTable({ items, loading, onEdit, onDelete }: Props) {
  return (
    <Table
      aria-label="Submissions table"
      isHeaderSticky
      removeWrapper
      shadow="sm"
      classNames={{
        wrapper: "rounded-xl shadow-lg",
        thead: "bg-default-100 dark:bg-default-50/90 backdrop-blur",
        th: "text-default-500 font-semibold uppercase text-xs tracking-wide",
      }}
    >
      <TableHeader columns={[...COLUMNS]}>
        {(column: typeof COLUMNS[number]) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={items} isLoading={loading} loadingContent={<Spinner label="Loading..." />} emptyContent="No submissions found.">
        {(item: SubmissionItem) => (
          <TableRow key={item.id} className="hover:bg-default-100/60 transition-colors">
            {(columnKey) => (
              <TableCell>
                {String(columnKey) === "feedbackTitle" ? (
                  <Link href={`/submissions/${item.feedbackId}`} className="text-primary underline-offset-2 hover:underline">
                    <SubmissionCellRenderer columnKey={String(columnKey)} item={item} onEdit={onEdit} onDelete={onDelete} />
                  </Link>
                ) : (
                  <SubmissionCellRenderer columnKey={String(columnKey)} item={item} onEdit={onEdit} onDelete={onDelete} />
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


