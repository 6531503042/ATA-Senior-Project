"use client";

import { Input, Select, SelectItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { SearchIcon, RefreshCwIcon, EllipsisVertical } from "lucide-react";
import type { SubmissionPrivacy, SubmissionStatus } from "@/types/submission";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  onClear: () => void;
  privacy: SubmissionPrivacy[];
  onPrivacyChange: (v: SubmissionPrivacy[]) => void;
  status: SubmissionStatus[];
  onStatusChange: (v: SubmissionStatus[]) => void;
  onRefresh: () => void;
};

export default function TopContent({ query, onQueryChange, onClear, privacy, onPrivacyChange, status, onStatusChange, onRefresh }: Props) {
  const privacyOptions: { key: SubmissionPrivacy; label: string }[] = [
    { key: "PUBLIC", label: "Public" },
    { key: "ANONYMOUS", label: "Anonymous" },
  ];

  const statusOptions: { key: SubmissionStatus; label: string }[] = [
    { key: "analyzed", label: "Analyzed" },
    { key: "pending", label: "Pending" },
    { key: "error", label: "Error" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/90 dark:bg-default-50/90 backdrop-blur p-3 shadow-lg">
      <div className="flex w-full items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <Input
            isClearable
            className="w-full"
            placeholder="Search submissions..."
            startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
            value={query}
            onClear={onClear}
            onValueChange={onQueryChange}
            variant="bordered"
          />
        </div>

        <div className="flex items-end gap-3">
          <Select
            label="Privacy"
            placeholder="All privacy"
            selectedKeys={new Set(privacy)}
            onSelectionChange={(keys) => onPrivacyChange(Array.from(keys) as SubmissionPrivacy[])}
            selectionMode="multiple"
            className="w-[180px]"
          >
            {privacyOptions.map((p) => (
              <SelectItem key={p.key}>{p.label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Status"
            placeholder="All status"
            selectedKeys={new Set(status)}
            onSelectionChange={(keys) => onStatusChange(Array.from(keys) as SubmissionStatus[])}
            selectionMode="multiple"
            className="w-[180px]"
          >
            {statusOptions.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>

          <Button color="primary" variant="flat" startContent={<RefreshCwIcon className="w-4 h-4" />} onPress={onRefresh}>
            Refresh
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <EllipsisVertical className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="export">Export</DropdownItem>
              <DropdownItem key="share">Share</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}


