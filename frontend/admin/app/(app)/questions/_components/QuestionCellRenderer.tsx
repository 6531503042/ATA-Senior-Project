import { Key } from 'react';
import { Chip, Button, Checkbox } from '@heroui/react';
import {
  EditIcon,
  TrashIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  StarIcon,
  ToggleLeftIcon,
} from 'lucide-react';

import { Question } from '@/types/question';

// Question utility functions
function formatQuestionType(type: string): string {
  if (!type) return 'Unknown';
  
  switch (type.toUpperCase()) {
    case 'MULTIPLE_CHOICE':
      return 'Multiple Choice';
    case 'TEXT':
      return 'Text Based';
    case 'RATING':
      return 'Rating';
    case 'BOOLEAN':
      return 'Boolean';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
}

function formatCategory(category: string): string {
  if (!category) return 'General';
  
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

function getQuestionTypeColor(type: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  switch (type?.toUpperCase()) {
    case 'MULTIPLE_CHOICE':
      return 'primary';
    case 'TEXT':
      return 'success';
    case 'RATING':
      return 'warning';
    case 'BOOLEAN':
      return 'danger';
    default:
      return 'default';
  }
}

function getCategoryColor(category: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  switch (category?.toLowerCase()) {
    case 'general':
      return 'default';
    case 'technical':
      return 'primary';
    case 'feedback':
      return 'success';
    case 'survey':
      return 'warning';
    case 'assessment':
      return 'danger';
    default:
      return 'secondary';
  }
}

export type QuestionColumnKey =
  | 'question'
  | 'type'
  | 'category'
  | 'required'
  | 'status'
  | 'actions';

type QuestionCellRendererProps = {
  question: Question;
  columnKey: Key;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
};

export default function QuestionCellRenderer({
  question,
  columnKey,
  onEdit,
  onDelete,
}: QuestionCellRendererProps) {
  const getTypeIcon = (type: Question['type']) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'TEXT':
        return <MessageSquareIcon className="w-4 h-4" />;
      case 'RATING':
        return <StarIcon className="w-4 h-4" />;
      case 'BOOLEAN':
        return <ToggleLeftIcon className="w-4 h-4" />;
      default:
        return <MessageSquareIcon className="w-4 h-4" />;
    }
  };

  switch (columnKey) {
    case 'question':
      return (
        <div className="flex items-start gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            {getTypeIcon(question.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {question.text}
            </h3>
            {question.options && question.options.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-default-400 mb-1">Options:</p>
                <div className="flex flex-wrap gap-1">
                  {question.options.slice(0, 3).map((option, index) => (
                    <span
                      key={index}
                      className="text-xs bg-default-100 px-2 py-1 rounded-md"
                    >
                      {option.text}
                    </span>
                  ))}
                  {question.options.length > 3 && (
                    <span className="text-xs text-default-400">
                      +{question.options.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'type':
      return (
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            color={getQuestionTypeColor(question.type)}
            variant="flat"
            className="text-xs"
          >
            {formatQuestionType(question.type)}
          </Chip>
        </div>
      );

    case 'category':
      return (
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            color={getCategoryColor(question.category || 'general')}
            variant="flat"
            className="text-xs"
          >
            {formatCategory(question.category || 'general')}
          </Chip>
        </div>
      );

    case 'required':
      return (
        <Checkbox
          isSelected={question.required}
          isReadOnly
          size="sm"
        />
      );

    case 'status':
      return (
        <Chip
          size="sm"
          color={question.required ? 'success' : 'default'}
          variant="flat"
          className="text-xs"
        >
          {question.required ? 'Required' : 'Optional'}
        </Chip>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEdit(question)}
            >
              <EditIcon className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onDelete(question.id.toString())}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      );

    default:
      return null;
  }
}
