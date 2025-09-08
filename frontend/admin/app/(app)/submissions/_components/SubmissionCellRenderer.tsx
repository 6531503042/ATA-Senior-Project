'use client';

import type { SubmissionItem } from '@/types/submission';

import {
  Chip,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from '@heroui/react';
import { PenLine, Trash2, Eye, MoreVertical } from 'lucide-react';

type Props = {
  columnKey: string | number;
  item: SubmissionItem;
  onEdit?: (item: SubmissionItem) => void;
  onDelete?: (item: SubmissionItem) => void;
  onView?: (item: SubmissionItem) => void;
};

export default function SubmissionCellRenderer({
  columnKey,
  item,
  onEdit,
  onDelete,
  onView,
}: Props) {
  switch (columnKey) {
    case 'id':
      return <span className="text-default-700 font-medium">#{item.id}</span>;
    case 'feedbackTitle':
      return (
        <div className="flex flex-col">
          <span className="text-default-900 font-medium">
            {item.feedbackTitle}
          </span>
          <span className="text-default-500 text-xs">{item.projectName}</span>
        </div>
      );
    case 'submittedBy':
      return (
        <span className="text-default-700">
          {item.submittedBy ? `User #${item.submittedBy}` : 'Anonymous'}
        </span>
      );
    case 'privacy':
      return (
        <Chip
          color={item.privacyLevel === 'PUBLIC' ? 'success' : 'warning'}
          size="sm"
          variant="flat"
        >
          {item.privacyLevel}
        </Chip>
      );
    case 'submittedAt':
      return (
        <span className="text-default-600 text-sm">
          {new Date(item.submittedAt).toLocaleString()}
        </span>
      );
    case 'status':
      return (
        <Chip
          color={
            item.status === 'analyzed'
              ? 'success'
              : item.status === 'pending'
                ? 'primary'
                : 'danger'
          }
          size="sm"
          variant="flat"
        >
          {item.status}
        </Chip>
      );
    case 'overallSentiment':
      return item.overallSentiment ? (
        <Chip
          color={
            item.overallSentiment === 'positive'
              ? 'success'
              : item.overallSentiment === 'neutral'
                ? 'default'
                : 'danger'
          }
          size="sm"
          variant="flat"
        >
          {item.overallSentiment}
        </Chip>
      ) : (
        <span className="text-default-400">—</span>
      );
    case 'actions':
      return (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="flat" onPress={() => onView?.(item)} startContent={<Eye className="w-4 h-4" />}>View</Button>
          <Button size="sm" variant="flat" onPress={() => onEdit?.(item)} startContent={<PenLine className="w-4 h-4" />}>Edit</Button>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="hover:bg-default-100" aria-label="More actions">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={() => onDelete?.(item)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      return <span />;
  }
}
