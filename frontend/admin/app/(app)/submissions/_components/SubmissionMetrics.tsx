"use client";

import { Card, CardBody } from "@heroui/react";

type Props = {
  total: number;
  analyzed: number;
  pending: number;
};

export default function SubmissionMetrics({ total, analyzed, pending }: Props) {
  const completedPct = total > 0 ? Math.round((analyzed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard label="Total Submissions" value={total} color="blue" />
      <MetricCard label="Analyzed" value={analyzed} color="green" />
      <MetricCard label="Pending" value={`${pending} (${completedPct}% done)`} color="yellow" />
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: "blue" | "green" | "yellow";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <Card shadow="sm" className={`rounded-xl backdrop-blur-sm p-4 ${colors[color]} border border-${color}-100 hover:shadow-md transition-all`}>
      <CardBody className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardBody>
    </Card>
  );
}
