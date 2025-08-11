"use client";

import { Card, CardBody } from "@heroui/react";
import type { SubmissionItem } from "@/types/submission";

export default function SubmissionDetails({ item }: { item: SubmissionItem }) {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-2 text-sm">
        <Row label="ID" value={`#${item.id}`} />
        <Row label="Feedback" value={item.feedbackTitle} />
        <Row label="Project" value={item.projectName} />
        <Row label="Submitted" value={new Date(item.submittedAt).toLocaleString()} />
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


