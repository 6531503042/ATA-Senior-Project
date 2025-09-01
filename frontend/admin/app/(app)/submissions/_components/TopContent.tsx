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
    <div className="flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 backdrop-blur-lg p-5 shadow-xl border border-transparent hover:border-indigo-300 transition-all duration-300">
      <div className="flex w-full items-center justify-between gap-4 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-[260px]">
          <Input
            isClearable
            className="w-full rounded-lg shadow-sm focus:shadow-md transition-shadow duration-200"
            placeholder="Search submissions..."
            startContent={<SearchIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />}
            value={query}
            onClear={onClear}
            onValueChange={onQueryChange}
            variant="bordered"
          />
        </div>


        <div className="flex items-end gap-3 flex-wrap">
          <Select
            label="Privacy"
            placeholder="All privacy"
            selectedKeys={new Set(privacy)}
            onSelectionChange={(keys) => onPrivacyChange(Array.from(keys) as SubmissionPrivacy[])}
            selectionMode="multiple"
            className="w-[180px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
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
            className="w-[180px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {statusOptions.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>

          <Button
            color="primary"
            variant="flat"
            startContent={<RefreshCwIcon className="w-4 h-4" />}
            onPress={onRefresh}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
              >
                <EllipsisVertical className="text-gray-500 dark:text-gray-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
              <DropdownItem key="export" className="hover:bg-indigo-100 dark:hover:bg-gray-600 rounded transition-all duration-150">
                Export
              </DropdownItem>
              <DropdownItem key="share" className="hover:bg-indigo-100 dark:hover:bg-gray-600 rounded transition-all duration-150">
                Share
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
