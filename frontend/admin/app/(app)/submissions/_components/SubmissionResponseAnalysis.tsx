"use client";

import { Card, CardHeader, CardBody, Chip, Divider } from "@heroui/react";
import { MessageSquareMore, ListChecks } from "lucide-react";

export default function SubmissionResponseAnalysis() {
  const items = [
    { label: "Clear requirements", score: 86, tone: "positive" as const },
    { label: "Communication gaps", score: 62, tone: "neutral" as const },
    { label: "Tooling issues", score: 48, tone: "negative" as const },
  ];

  return (
    <Card shadow="sm" className="bg-white/90 dark:bg-default-50/90 backdrop-blur">
      <CardHeader className="flex items-center gap-3 pb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
          <MessageSquareMore className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold">Response Analysis</h3>
          <p className="text-default-500 text-xs">Top topics and tone</p>
        </div>
      </CardHeader>
      <Divider className="opacity-70" />
      <CardBody className="space-y-3 pt-4">
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.label} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-default-100"><ListChecks className="w-3.5 h-3.5 text-default-600" /></div>
                <span className="text-sm font-medium">{it.label}</span>
              </div>
              <Chip size="sm" variant="flat" color={it.tone === "positive" ? "success" : it.tone === "neutral" ? "default" : "danger"}>
                {it.score}%
              </Chip>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}


