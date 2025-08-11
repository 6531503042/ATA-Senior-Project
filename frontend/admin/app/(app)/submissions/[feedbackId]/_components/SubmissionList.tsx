"use client";

import { Card, CardBody, Chip, Input } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import type { SubmissionItem } from "@/types/submission";
import { useMemo, useState } from "react";

type Props = {
  items: SubmissionItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export default function SubmissionList({ items, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.id.includes(query) ||
          i.feedbackTitle.toLowerCase().includes(query.toLowerCase()) ||
          i.projectName.toLowerCase().includes(query.toLowerCase()) ||
          (i.submittedBy || "").includes(query),
      ),
    [items, query],
  );

  return (
    <Card shadow="sm" className="sticky top-6 border bg-white/90 dark:bg-default-50/90 backdrop-blur rounded-xl shadow-lg">
      <CardBody className="gap-4">
        <Input
          value={query}
          onValueChange={setQuery}
          variant="bordered"
          placeholder="Search submissions..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.map((i) => (
            <div
              key={i.id}
              onClick={() => onSelect(i.id)}
              className={`cursor-pointer rounded-lg border px-3 py-2 transition-colors ${
                selectedId === i.id ? "border-primary bg-primary-50" : "border-default-200 hover:bg-default-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Submission #{i.id}</div>
                <Chip size="sm" variant="flat" color={i.privacy === "PUBLIC" ? "success" : "warning"}>
                  {i.privacy}
                </Chip>
              </div>
              <div className="mt-1 text-xs text-default-500">{i.projectName}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-default-500 text-sm py-4">No submissions found</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}


