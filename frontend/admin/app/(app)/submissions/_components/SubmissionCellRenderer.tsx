"use client";

import { Chip, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button, Tooltip } from "@heroui/react";
import { PenLine, Trash2 } from "lucide-react";
import type { SubmissionItem } from "@/types/submission";

type Props = {
  columnKey: string | number;
  item: SubmissionItem;
  onEdit?: (item: SubmissionItem) => void;
  onDelete?: (item: SubmissionItem) => void;
};

export default function SubmissionCellRenderer({ columnKey, item, onEdit, onDelete }: Props) {
  switch (columnKey) {
    case "id":
      return <span className="text-default-700 font-medium">#{item.id}</span>;
    case "feedbackTitle":
      return (
        <div className="flex flex-col">
          <span className="text-default-900 font-medium">{item.feedbackTitle}</span>
          <span className="text-default-500 text-xs">{item.projectName}</span>
        </div>
      );
    case "submittedBy":
      return <span className="text-default-700">{item.submittedBy ? `User #${item.submittedBy}` : "Anonymous"}</span>;
    case "privacy":
      return (
        <Chip size="sm" color={item.privacy === "PUBLIC" ? "success" : "warning"} variant="flat">
          {item.privacy}
        </Chip>
      );
    case "submittedAt":
      return <span className="text-default-600 text-sm">{new Date(item.submittedAt).toLocaleString()}</span>;
    case "status":
      return (
        <Chip
          size="sm"
          color={item.status === "analyzed" ? "success" : item.status === "pending" ? "primary" : "danger"}
          variant="flat"
        >
          {item.status}
        </Chip>
      );
    case "overallSentiment":
      return item.overallSentiment ? (
        <Chip
          size="sm"
          color={item.overallSentiment === "positive" ? "success" : item.overallSentiment === "neutral" ? "default" : "danger"}
          variant="flat"
        >
          {item.overallSentiment}
        </Chip>
      ) : (
        <span className="text-default-400">—</span>
      );
    case "actions":
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button size="sm" variant="light">Actions</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="edit" startContent={<PenLine className="w-4 h-4" />} onPress={() => onEdit?.(item)}>
              Edit
            </DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 className="w-4 h-4" />} onPress={() => onDelete?.(item)}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    default:
      return <span />;
  }
}


