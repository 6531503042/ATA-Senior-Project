'use client';

import { Card, CardBody, Input } from '@heroui/react';
import { FilterIcon } from 'lucide-react';
import type { FeedbackStatus } from '@/types/feedback';

export default function FeedbackFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  project,
  onProjectChange,
  projectOptions,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  status: 'all' | FeedbackStatus;
  onStatusChange: (v: 'all' | FeedbackStatus) => void;
  project: 'all' | string;
  onProjectChange: (v: 'all' | string) => void;
  projectOptions: string[];
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardBody className="gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Input
              label="Search"
              placeholder="Search subject, message, project, category"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              startContent={<FilterIcon className="w-4 h-4 text-default-400" />}
            />
          </div>
          <div>
            <label className="text-xs text-default-500 block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as any)}
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
              onChange={(e) => onProjectChange(e.target.value)}
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
  );
}