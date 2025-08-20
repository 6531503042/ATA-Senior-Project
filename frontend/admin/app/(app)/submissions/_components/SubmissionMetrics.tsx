'use client';

import { Card, CardBody } from '@heroui/react';

type Props = {
  total: number;
  analyzed: number;
  pending: number;
};

export default function SubmissionMetrics({ total, analyzed, pending }: Props) {
  const completedPct = total > 0 ? Math.round((analyzed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <MetricCard label="Total Submissions" value={total} />
      <MetricCard label="Analyzed" value={analyzed} />
      <MetricCard
        label="Pending"
        value={`${pending} (${completedPct}% done)`}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card
      className="bg-white/90 dark:bg-default-50/90 backdrop-blur shadow-lg"
      shadow="sm"
    >
      <CardBody className="space-y-1">
        <div className="text-xs uppercase tracking-wide text-default-400">
          {label}
        </div>
        <div className="text-2xl font-semibold">{value}</div>
      </CardBody>
    </Card>
  );
}
