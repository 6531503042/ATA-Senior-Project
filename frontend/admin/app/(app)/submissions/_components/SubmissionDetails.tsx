'use client';

import type { SubmissionItem } from '@/types/submission';
import type { ReactNode } from 'react';

import { Chip } from '@heroui/react';

export default function SubmissionDetails({ item }: { item: SubmissionItem }) {
  if (!item) return null;

  return (
    <div className="space-y-3 text-sm">
      <Row label="ID" value={`#${item.id}`} />
      <Row label="Feedback" value={item.feedbackTitle} />
      <Row label="Project" value={item.projectName} />
      <Row
        label="Submitted By"
        value={item.submittedBy ? `User #${item.submittedBy}` : 'Anonymous'}
      />
      <Row
        label="Privacy"
        value={
          <Chip
            color={item.privacy === 'PUBLIC' ? 'success' : 'warning'}
            size="sm"
            variant="flat"
          >
            {item.privacy}
          </Chip>
        }
      />
      <Row
        label="Status"
        value={
          <Chip
            color={
              item.status === 'analyzed'
                ? 'success'
                : item.status === 'pending'
                  ? 'primary'
                  : 'danger'
            }
            size="sm"
            variant="flat"
          >
            {item.status}
          </Chip>
        }
      />
      <Row
        label="Sentiment"
        value={
          item.overallSentiment ? (
            <Chip
              color={
                item.overallSentiment === 'positive'
                  ? 'success'
                  : item.overallSentiment === 'neutral'
                    ? 'default'
                    : 'danger'
              }
              size="sm"
              variant="flat"
            >
              {item.overallSentiment}
            </Chip>
          ) : (
            <span className="text-default-400">—</span>
          )
        }
      />
      <Row
        label="Submitted At"
        value={new Date(item.submittedAt).toLocaleString()}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-default-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
