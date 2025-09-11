import { Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Key } from 'react';
import {
  EditIcon,
  TrashIcon,
  MoreVerticalIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ToggleLeftIcon,
  MessageSquareIcon,
  CopyIcon,
  ArchiveIcon,
  TrendingUpIcon,
} from 'lucide-react';

import { Question } from '@/types/question';

// Enhanced question type configuration with proper icons
const questionTypeConfig = {
  TEXT: {
    color: 'default' as const,
    icon: '📝',
    label: 'Text Input',
    description: 'Free text response',
    bgColor: 'from-blue-50 to-indigo-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  MULTIPLE_CHOICE: {
    color: 'primary' as const,
    icon: '☑️',
    label: 'Multiple Choice',
    description: 'Select from options',
    bgColor: 'from-purple-50 to-violet-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  RATING: {
    color: 'warning' as const,
    icon: '⭐',
    label: 'Rating Scale',
    description: 'Numeric rating',
    bgColor: 'from-amber-50 to-orange-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  BOOLEAN: {
    color: 'success' as const,
    icon: '✅',
    label: 'Yes/No',
    description: 'Boolean choice',
    bgColor: 'from-emerald-50 to-green-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
} as const;

// Question status configuration
const questionStatusConfig = {
  active: {
    color: 'success' as const,
    icon: '🟢',
    label: 'Active',
    description: 'Question is active',
    bgColor: 'from-green-50 to-emerald-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  inactive: {
    color: 'default' as const,
    icon: '⚪',
    label: 'Inactive',
    description: 'Question is inactive',
    bgColor: 'from-gray-50 to-slate-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
  },
  draft: {
    color: 'warning' as const,
    icon: '🟡',
    label: 'Draft',
    description: 'Question is in draft',
    bgColor: 'from-yellow-50 to-amber-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
} as const;

interface QuestionCellRendererProps {
  question: Question;
  columnKey: Key;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
}

export default function QuestionCellRenderer({
  question,
  columnKey,
  onEdit,
  onDelete,
}: QuestionCellRendererProps) {
  const cellValue = question[columnKey as keyof Question];

  switch (columnKey) {
    case 'question':
      return (
        <div className="max-w-xs space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
              <MessageSquareIcon className="w-5 h-5 text-blue-600" />
          </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-default-900 line-clamp-2 leading-relaxed">
                {question.text}
              </p>
            {question.options && question.options.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Chip size="sm" variant="flat" color="secondary" className="text-xs">
                    {question.options.length} options
                  </Chip>
                    <span className="text-xs text-default-400">
                    Order: {question.order || 1}
                    </span>
                </div>
              )}
              </div>
          </div>
        </div>
      );

    case 'type':
      const typeConfig = questionTypeConfig[question.type as keyof typeof questionTypeConfig];
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.bgColor} border ${typeConfig.borderColor} flex items-center justify-center shadow-sm`}>
              <span className="text-xl" role="img" aria-label={`${question.type} question type`}>
                {typeConfig.icon}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
          <Chip
            size="sm"
            variant="flat"
              color={typeConfig.color}
              className="capitalize font-medium"
          >
              {typeConfig.label}
          </Chip>
            <span className="text-xs text-default-500">
              {typeConfig.description}
            </span>
          </div>
        </div>
      );

    case 'category':
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200 flex items-center justify-center shadow-sm">
              <span className="text-lg">🏷️</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
          <Chip
            size="sm"
            variant="flat"
              color="secondary"
              className="capitalize font-medium"
          >
              {question.category || 'General'}
          </Chip>
            <span className="text-xs text-default-500">
              Question category
            </span>
          </div>
        </div>
      );

    case 'required':
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {question.required ? (
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border border-green-200 flex items-center justify-center shadow-sm">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                <XCircleIcon className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {question.required ? (
              <Chip
                size="sm"
                variant="flat"
                color="success"
                className="font-medium"
              >
                Required
              </Chip>
            ) : (
              <Chip
          size="sm"
                variant="flat"
                color="default"
                className="font-medium"
              >
                Optional
              </Chip>
            )}
            <span className="text-xs text-default-500">
              {question.required ? 'Mandatory question' : 'Optional question'}
            </span>
          </div>
        </div>
      );

    case 'status':
      const statusConfig = questionStatusConfig.active; // Default to active for now
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${statusConfig.bgColor} border ${statusConfig.borderColor} flex items-center justify-center shadow-sm`}>
              <span className="text-lg" role="img" aria-label="Question status">
                {statusConfig.icon}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
        <Chip
          size="sm"
          variant="flat"
              color={statusConfig.color}
              className="font-medium"
        >
              {statusConfig.label}
        </Chip>
            <span className="text-xs text-default-500">
              {statusConfig.description}
            </span>
          </div>
        </div>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2 justify-center">
            <Button
              isIconOnly
              size="sm"
              variant="light"
            color="primary"
            onPress={() => onEdit?.(question)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
            title="Edit question"
            >
              <EditIcon className="w-4 h-4" />
            </Button>
          
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
            onPress={() => onDelete?.(question.id.toString())}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            title="Delete question"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-default-600 hover:text-default-700 hover:bg-default-50 transition-all duration-200"
                title="More options"
              >
                <MoreVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Question actions">
              <DropdownItem
                key="view"
                startContent={<EyeIcon className="w-4 h-4" />}
                onPress={() => {}}
                className="text-default-600"
              >
                View Details
              </DropdownItem>
              <DropdownItem
                key="edit"
                startContent={<EditIcon className="w-4 h-4" />}
                onPress={() => onEdit?.(question)}
                className="text-blue-600"
              >
                Edit Question
              </DropdownItem>
              <DropdownItem
                key="duplicate"
                startContent={<CopyIcon className="w-4 h-4" />}
                onPress={() => {}}
                className="text-purple-600"
              >
                Duplicate
              </DropdownItem>
              <DropdownItem
                key="archive"
                startContent={<ArchiveIcon className="w-4 h-4" />}
                onPress={() => {}}
                className="text-orange-600"
              >
                Archive
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<TrashIcon className="w-4 h-4" />}
                onPress={() => onDelete?.(question.id.toString())}
              >
                Delete Question
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );

    default:
      return (
        <span className="text-sm text-default-600">
          {String(cellValue || '')}
        </span>
      );
  }
}
