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
} from 'lucide-react';

import { Question } from '@/types/question';

const questionTypeColors = {
  TEXT: 'default',
  MULTIPLE_CHOICE: 'primary',
  RATING: 'warning',
  BOOLEAN: 'success',
} as const;

const questionTypeIcons = {
  TEXT: '📝',
  MULTIPLE_CHOICE: '☑️',
  RATING: '⭐',
  BOOLEAN: '✅',
} as const;

const questionTypeLabels = {
  TEXT: 'Text Input',
  MULTIPLE_CHOICE: 'Multiple Choice',
  RATING: 'Rating Scale',
  BOOLEAN: 'Yes/No',
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
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <MessageSquareIcon className="w-4 h-4 text-blue-600" />
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
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <span className="text-2xl" role="img" aria-label={`${question.type} question type`}>
              {questionTypeIcons[question.type as keyof typeof questionTypeIcons]}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Chip
              size="sm"
              variant="flat"
              color={questionTypeColors[question.type as keyof typeof questionTypeColors]}
              className="capitalize font-medium"
            >
              {questionTypeLabels[question.type as keyof typeof questionTypeLabels]}
            </Chip>
            <span className="text-xs text-default-500 capitalize">
              {question.type.replace('_', ' ').toLowerCase()}
            </span>
          </div>
        </div>
      );

    case 'category':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
          <Chip
            size="sm"
            variant="flat"
            color="secondary"
            className="capitalize font-medium"
          >
            {question.category || 'General'}
          </Chip>
        </div>
      );

    case 'required':
      return (
        <div className="flex items-center gap-2">
          {question.required ? (
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <Chip
                size="sm"
                variant="flat"
                color="success"
                className="font-medium"
              >
                Required
              </Chip>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircleIcon className="w-4 h-4 text-default-400" />
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="font-medium"
              >
                Optional
              </Chip>
            </div>
          )}
        </div>
      );

    case 'status':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <Chip
            size="sm"
            variant="flat"
            color="success"
            className="font-medium"
          >
            Active
          </Chip>
        </div>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2">
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
                startContent={<ToggleLeftIcon className="w-4 h-4" />}
                onPress={() => {}}
                className="text-purple-600"
              >
                Duplicate
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
