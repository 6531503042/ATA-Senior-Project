"use client";

import { Card, CardBody, Chip, Divider } from "@heroui/react";
import type { SubmissionItem } from "@/types/submission";

type Props = {
  item: SubmissionItem | null;
};

export default function DetailsPanel({ item }: Props) {
  if (!item) {
    return (
      <Card shadow="sm" className="bg-white/90 dark:bg-default-50/90 backdrop-blur">
        <CardBody className="min-h-[300px] flex items-center justify-center text-default-500 text-sm">
          Select a submission to view details
        </CardBody>
      </Card>
    );
  }
  return (
    <Card shadow="sm" className="bg-white/90 dark:bg-default-50/90 backdrop-blur">
      <CardBody className="space-y-4 text-sm">
        <Row label="ID" value={`#${item.id}`} />
        <Row label="Feedback" value={item.feedbackTitle} />
        <Row label="Project" value={item.projectName} />
        <Row label="Submitted By" value={item.submittedBy ? `User #${item.submittedBy}` : "Anonymous"} />
        <div className="flex items-center justify-between">
          <span className="text-default-500">Privacy</span>
          <Chip size="sm" variant="flat" color={item.privacy === "PUBLIC" ? "success" : "warning"}>
            {item.privacy}
          </Chip>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-500">Status</span>
          <Chip size="sm" variant="flat" color={item.status === "analyzed" ? "success" : item.status === "pending" ? "primary" : "danger"}>
            {item.status}
          </Chip>
        </div>
        <Row label="Submitted At" value={new Date(item.submittedAt).toLocaleString()} />
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


