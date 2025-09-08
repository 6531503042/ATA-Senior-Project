'use client';

// Local DTO
type SubmitDto = {
  id: number;
  feedbackId: number;
  submittedBy?: string | null;
  submittedAt: string;
  overallComments?: string | null;
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS' | 'CONFIDENTIAL';
};

import { Card, CardBody, Chip, Divider } from '@heroui/react';

type Props = { item: SubmitDto | null };

export default function DetailsPanel({ item }: Props) {
  if (!item) {
    return (
      <Card
        className="bg-white/90 dark:bg-default-50/90 backdrop-blur"
        shadow="sm"
      >
        <CardBody className="min-h-[300px] flex items-center justify-center text-default-500 text-sm">
          Select a submission to view details
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      className="bg-white/90 dark:bg-default-50/90 backdrop-blur rounded-2xl border-0 shadow-xl"
      shadow="sm"
    >
      <CardBody className="space-y-4 text-sm p-5">
        <Row label="ID" value={`#${item.id}`} />
        <Row label="Feedback" value={(item as any).feedbackTitle || `#${item.feedbackId}`} />
        {/* Project can be shown elsewhere; keep essentials here */}
        <Row
          label="Submitted By"
          value={item.submittedBy ? `User #${item.submittedBy}` : 'Anonymous'}
        />
        <div className="flex items-center justify-between">
          <span className="text-default-500">Privacy</span>
          <Chip color={item.privacyLevel === 'PUBLIC' ? 'success' : 'warning'} size="sm" variant="flat">
            {item.privacyLevel}
          </Chip>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-500">Status</span>
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
        </div>
        <Row
          label="Submitted At"
          value={new Date(item.submittedAt).toLocaleString()}
        />
        <Divider />
        <div className="text-xs text-default-500">More details will appear here in the full integration.</div>
      </CardBody>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-default-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
