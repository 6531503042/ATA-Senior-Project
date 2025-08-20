"use client";

import { Card, CardHeader, CardBody, CardFooter, Chip, Progress, Button, Divider } from "@heroui/react";
import { Download, Share2 } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  confidence?: {
    overall: number;
    performance: number;
    engagement: number;
    improvement: number;
  };
};

export default function AIInsightsCard({
  title = "AI Insights",
  description = "Analysis of feedback submissions",
  confidence = { overall: 78, performance: 82, engagement: 74, improvement: 69 },
}: Props) {
  return (
    <Card shadow="sm" className="bg-white/90 dark:bg-default-50/90 backdrop-blur shadow-lg">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-default-500 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="flat" startContent={<Download className="w-4 h-4" />}>Export</Button>
          <Button size="sm" variant="flat" startContent={<Share2 className="w-4 h-4" />}>Share</Button>
        </div>
      </CardHeader>
      <Divider className="opacity-70" />
      <CardBody className="gap-5 pt-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Overall Confidence</span>
            <Chip size="sm" variant="flat" color={confidence.overall >= 80 ? "success" : confidence.overall >= 60 ? "primary" : "warning"}>
              {confidence.overall}%
            </Chip>
          </div>
          <Progress aria-label="overall" value={confidence.overall} className="h-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Section label="Performance" value={confidence.performance} />
          <Section label="Engagement" value={confidence.engagement} />
          <Section label="Improvement" value={confidence.improvement} />
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Key Recommendations</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between rounded-lg border border-black/10 shadow-md shadow-slate-200/50 px-3 py-2">
              <span className="text-sm text-default-700">Clarify onboarding checklist</span>
              <Chip size="sm" variant="flat" color="warning">High</Chip>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-black/10 shadow-md shadow-slate-200/50 px-3 py-2">
              <span className="text-sm text-default-700">Improve cross-team communication</span>
              <Chip size="sm" variant="flat" color="primary">Medium</Chip>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-black/10 shadow-md shadow-slate-200/50 px-3 py-2">
              <span className="text-sm text-default-700">Refine feedback form copy</span>
              <Chip size="sm" variant="flat">Low</Chip>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}

function Section({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}</span>
        <Chip size="sm" variant="flat" color={value >= 80 ? "success" : value >= 60 ? "primary" : "warning"}>
          {value}%
        </Chip>
      </div>
      <Progress aria-label={label} value={value} className="h-2" />
    </div>
  );
}


